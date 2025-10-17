import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../services/taskService';
import { useState, useEffect } from 'react';

export const useTasks = (filters = {}) => {
  const queryClient = useQueryClient();
  const [allTasks, setAllTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [cachedAllTasks, setCachedAllTasks] = useState([]);
  const [filterChanged, setFilterChanged] = useState(false); 

  // Get tasks query
  const {
    data: tasksData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['tasks', currentPage, filters],
    queryFn: () => {
      const params = { page: currentPage };
      
      // Only add search parameter if it's not empty
      if (filters.search && filters.search.trim() !== '') {
        params.search = filters.search.trim();
      }
      
      // Only add status parameter if it's not empty
      if (filters.status && filters.status !== '') {
        params.status = filters.status;
      }
      
      return taskService.getTasks(params);
    },
    enabled: !!localStorage.getItem('token'),
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // Check if filters are empty
  const isFiltersEmpty = (!filters.search || filters.search.trim() === '') && 
                        (!filters.status || filters.status === '');

  // Update allTasks when new data arrives
  useEffect(() => {
    if (tasksData?.data) {
      if (currentPage === 1 || filterChanged) {
        // First page or filter changed - replace all data
        setAllTasks(tasksData.data);
        setFilterChanged(false);
        
        // Cache data only when filters are empty
        if (isFiltersEmpty) {
          setCachedAllTasks(tasksData.data);
        }
      } else {
        // Subsequent pages - append to existing data, avoiding duplicates
        setAllTasks(prev => {
          const existingIds = new Set(prev.map(task => task.id));
          const newTasks = tasksData.data.filter(task => !existingIds.has(task.id));
          return [...prev, ...newTasks];
        });
        
        // Update cache only when filters are empty
        if (isFiltersEmpty) {
          setCachedAllTasks(prev => {
            const existingIds = new Set(prev.map(task => task.id));
            const newTasks = tasksData.data.filter(task => !existingIds.has(task.id));
            return [...prev, ...newTasks];
          });
        }
      }
      
      // Check if there are more pages
      const hasMore = tasksData.meta?.current_page < tasksData.meta?.last_page;
      setHasNextPage(hasMore);
      setIsLoadingMore(false);
    }
  }, [tasksData, currentPage, isFiltersEmpty, filterChanged, filters.status]);

  // Reset to first page when filters change
  useEffect(() => {
    if (isFiltersEmpty && cachedAllTasks.length > 0) {
      setAllTasks(cachedAllTasks);
      setFilterChanged(false);
    } else {
      setCurrentPage(1);
      setFilterChanged(true);
    }
  }, [filters.search, filters.status, isFiltersEmpty, cachedAllTasks]);

  // Load next page function
  const fetchNextPage = () => {
    if (hasNextPage && !isLoadingMore) {
      setIsLoadingMore(true);
      setCurrentPage(prev => prev + 1);
    }
  };

  // Client-side filtering
  const filteredTasks = allTasks.filter(task => {
    // Search filter
    if (filters.search && filters.search.trim() !== '') {
      const searchTerm = filters.search.toLowerCase();
      const titleMatch = task.title.toLowerCase().includes(searchTerm);
      const descriptionMatch = task.description.toLowerCase().includes(searchTerm);
      if (!titleMatch && !descriptionMatch) return false;
    }

    // Status filter
    if (filters.status && filters.status !== '') {
      if (task.status !== filters.status) return false;
    }

    return true;
  });

  // Create task mutation with optimistic updates
  const createMutation = useMutation({
    mutationFn: taskService.createTask,
    onMutate: async (newTask) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      // Snapshot the previous value from allTasks state
      const previousAllTasks = [...allTasks];

      // Optimistically update the UI
      const optimisticTask = {
        id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Unique temporary ID
        ...newTask,
        user_id: queryClient.getQueryData(['user'])?.data?.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Add to the beginning of the list
      setAllTasks(prev => [optimisticTask, ...prev]);

      return { previousAllTasks, optimisticTask };
    },
    onError: (err, newTask, context) => {
      // If the mutation fails, restore the previous state
      if (context?.previousAllTasks) {
        setAllTasks(context.previousAllTasks);
      }
    },
    onSuccess: (data, variables, context) => {
      // Replace the optimistic task with the real one
      setAllTasks(prev => {
        const withoutOptimistic = prev.filter(task => task.id !== context.optimisticTask.id);
        return [data.data || data, ...withoutOptimistic];
      });
      
      // Scroll to top to show the new task
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  });

  // Update task mutation with optimistic updates
  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }) => taskService.updateTask(id, data),
    onMutate: async ({ id, ...newData }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      // Snapshot the previous value from allTasks state
      const previousAllTasks = [...allTasks];

      // Optimistically update the UI
      setAllTasks(prev => 
        prev.map(task => 
          task.id === id 
            ? { ...task, ...newData, updated_at: new Date().toISOString() }
            : task
        )
      );

      return { previousAllTasks };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, restore the previous state
      if (context?.previousAllTasks) {
        setAllTasks(context.previousAllTasks);
      }
    },
    onSuccess: (data, variables) => {
      // Replace the optimistic task with the real one
      setAllTasks(prev => 
        prev.map(task => 
          task.id === variables.id 
            ? data.data || data
            : task
        )
      );
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  // Delete task mutation with optimistic updates
  const deleteMutation = useMutation({
    mutationFn: taskService.deleteTask,
    onMutate: async (taskId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      // Snapshot the previous value from allTasks state
      const previousAllTasks = [...allTasks];
      const deletedTask = allTasks.find(task => task.id === taskId);

      // Optimistically update the UI - remove the task
      setAllTasks(prev => prev.filter(task => task.id !== taskId));

      return { previousAllTasks, deletedTask };
    },
    onError: (err, taskId, context) => {
      // If the mutation fails, restore the task
      if (context?.deletedTask && context?.previousAllTasks) {
        setAllTasks(context.previousAllTasks);
      }
    },
    onSuccess: () => {
      // Task is already removed from UI, no need to do anything
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const createTask = (taskData) => createMutation.mutateAsync(taskData);
  const updateTask = (id, taskData) => updateMutation.mutateAsync({ id, ...taskData });
  const deleteTask = (id) => deleteMutation.mutateAsync(id);

  return {
    tasks: filteredTasks,
    allTasks,
    isLoading,
    error,
    refetch,
    createTask,
    updateTask,
    deleteTask,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
    // Infinite scroll functions
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage: isLoadingMore,
  };
};
