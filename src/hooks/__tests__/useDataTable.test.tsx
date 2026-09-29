/**
 * useDataTable Hook Tests
 */

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useDataTable } from '../useDataTable';
import type { ColumnDef, DataTableProps } from '@/types/table';

interface TestRow {
  id: string;
  name: string;
  age: number;
  status: 'active' | 'inactive';
}

const mockColumns: ColumnDef<TestRow>[] = [
  { id: 'name', header: 'Name', accessorKey: 'name' },
  { id: 'age', header: 'Age', accessorKey: 'age' },
  { id: 'status', header: 'Status', accessorKey: 'status' },
];

const mockData: TestRow[] = [
  { id: '1', name: 'Alice', age: 30, status: 'active' },
  { id: '2', name: 'Bob', age: 25, status: 'inactive' },
  { id: '3', name: 'Charlie', age: 35, status: 'active' },
  { id: '4', name: 'David', age: 28, status: 'active' },
  { id: '5', name: 'Eve', age: 32, status: 'inactive' },
];

describe('useDataTable - Basic Initialization', () => {
  it('initializes with default state', () => {
    const props: DataTableProps<TestRow> = {
      data: mockData,
      columns: mockColumns,
    };

    const { result } = renderHook(() => useDataTable(props));

    expect(result.current.state.sort).toBeNull();
    expect(result.current.state.globalFilter).toBe('');
    expect(result.current.state.activeFilters).toEqual([]);
    expect(result.current.state.pagination.pageIndex).toBe(0);
    expect(result.current.state.pagination.pageSize).toBe(10);
    expect(result.current.state.rowSelection).toEqual({});
    expect(result.current.totalRows).toBe(5);
  });

  it('initializes with custom page size', () => {
    const props: DataTableProps<TestRow> = {
      data: mockData,
      columns: mockColumns,
      defaultPageSize: 2,
    };

    const { result } = renderHook(() => useDataTable(props));

    expect(result.current.state.pagination.pageSize).toBe(2);
  });

  it('initializes with initial state', () => {
    const props: DataTableProps<TestRow> = {
      data: mockData,
      columns: mockColumns,
      initialState: {
        sort: { columnId: 'name', direction: 'asc' },
        globalFilter: 'test',
        pagination: { pageIndex: 1, pageSize: 5 },
      },
    };

    const { result } = renderHook(() => useDataTable(props));

    expect(result.current.state.sort?.columnId).toBe('name');
    expect(result.current.state.globalFilter).toBe('test');
    expect(result.current.state.pagination.pageIndex).toBe(1);
  });
});

describe('useDataTable - Sorting', () => {
  it('sorts data in ascending order', () => {
    const props: DataTableProps<TestRow> = {
      data: mockData,
      columns: mockColumns,
    };

    const { result } = renderHook(() => useDataTable(props));

    act(() => {
      result.current.setSortState({ columnId: 'age', direction: 'asc' });
    });

    expect(result.current.rows[0].age).toBe(25);
    expect(result.current.rows[result.current.rows.length - 1].age).toBe(35);
  });

  it('sorts data in descending order', () => {
    const props: DataTableProps<TestRow> = {
      data: mockData,
      columns: mockColumns,
    };

    const { result } = renderHook(() => useDataTable(props));

    act(() => {
      result.current.setSortState({ columnId: 'age', direction: 'desc' });
    });

    expect(result.current.rows[0].age).toBe(35);
    expect(result.current.rows[result.current.rows.length - 1].age).toBe(25);
  });

  it('sorts strings alphabetically', () => {
    const props: DataTableProps<TestRow> = {
      data: mockData,
      columns: mockColumns,
    };

    const { result } = renderHook(() => useDataTable(props));

    act(() => {
      result.current.setSortState({ columnId: 'name', direction: 'asc' });
    });

    expect(result.current.rows[0].name).toBe('Alice');
    expect(result.current.rows[result.current.rows.length - 1].name).toBe('Eve');
  });

  it('skips sorting in manual mode', () => {
    const props: DataTableProps<TestRow> = {
      data: mockData,
      columns: mockColumns,
      manualSorting: true,
    };

    const { result } = renderHook(() => useDataTable(props));

    const originalOrder = [...result.current.rows];

    act(() => {
      result.current.setSortState({ columnId: 'age', direction: 'asc' });
    });

    expect(result.current.rows).toEqual(originalOrder);
  });

  it('resets pagination when sorting', () => {
    const props: DataTableProps<TestRow> = {
      data: mockData,
      columns: mockColumns,
      defaultPageSize: 2,
    };

    const { result } = renderHook(() => useDataTable(props));

    act(() => {
      result.current.setPagination({ pageIndex: 2, pageSize: 2 });
    });

    expect(result.current.state.pagination.pageIndex).toBe(2);

    act(() => {
      result.current.setSortState({ columnId: 'name', direction: 'asc' });
    });

    expect(result.current.state.pagination.pageIndex).toBe(0);
  });
});

describe('useDataTable - Global Filter', () => {
  it('filters data by global search query', () => {
    const props: DataTableProps<TestRow> = {
      data: mockData,
      columns: mockColumns,
    };

    const { result } = renderHook(() => useDataTable(props));

    act(() => {
      result.current.setGlobalFilter('alice');
    });

    expect(result.current.rows).toHaveLength(1);
    expect(result.current.rows[0].name).toBe('Alice');
  });

  it('filters across multiple columns', () => {
    const props: DataTableProps<TestRow> = {
      data: mockData,
      columns: mockColumns,
    };

    const { result } = renderHook(() => useDataTable(props));

    act(() => {
      result.current.setGlobalFilter('active');
    });

    expect(result.current.rows).toHaveLength(3);
  });

  it('is case insensitive', () => {
    const props: DataTableProps<TestRow> = {
      data: mockData,
      columns: mockColumns,
    };

    const { result } = renderHook(() => useDataTable(props));

    act(() => {
      result.current.setGlobalFilter('ALICE');
    });

    expect(result.current.rows).toHaveLength(1);
    expect(result.current.rows[0].name).toBe('Alice');
  });

  it('skips filtering in manual mode', () => {
    const props: DataTableProps<TestRow> = {
      data: mockData,
      columns: mockColumns,
      manualFiltering: true,
    };

    const { result } = renderHook(() => useDataTable(props));

    act(() => {
      result.current.setGlobalFilter('alice');
    });

    expect(result.current.rows).toHaveLength(5);
  });

  it('resets pagination when filtering', () => {
    const props: DataTableProps<TestRow> = {
      data: mockData,
      columns: mockColumns,
      defaultPageSize: 2,
    };

    const { result } = renderHook(() => useDataTable(props));

    act(() => {
      result.current.setPagination({ pageIndex: 1, pageSize: 2 });
    });

    act(() => {
      result.current.setGlobalFilter('active');
    });

    expect(result.current.state.pagination.pageIndex).toBe(0);
  });
});

describe('useDataTable - Column Filters', () => {
  it('filters by single column', () => {
    const props: DataTableProps<TestRow> = {
      data: mockData,
      columns: mockColumns,
    };

    const { result } = renderHook(() => useDataTable(props));

    act(() => {
      result.current.setActiveFilters([
        { columnId: 'status', filter: { operator: 'equals', value: 'active' } },
      ]);
    });

    expect(result.current.rows).toHaveLength(3);
    expect(result.current.rows.every((r) => r.status === 'active')).toBe(true);
  });

  it('filters with multiple conditions', () => {
    const props: DataTableProps<TestRow> = {
      data: mockData,
      columns: mockColumns,
    };

    const { result } = renderHook(() => useDataTable(props));

    act(() => {
      result.current.setActiveFilters([
        { columnId: 'status', filter: { operator: 'equals', value: 'active' } },
        { columnId: 'age', filter: { operator: 'gt', value: 30 } },
      ]);
    });

    expect(result.current.rows).toHaveLength(1);
    expect(result.current.rows[0].name).toBe('Charlie');
  });

  it('handles contains operator', () => {
    const props: DataTableProps<TestRow> = {
      data: mockData,
      columns: mockColumns,
    };

    const { result } = renderHook(() => useDataTable(props));

    act(() => {
      result.current.setActiveFilters([
        { columnId: 'name', filter: { operator: 'contains', value: 'e' } },
      ]);
    });

    // Alice, Charlie, Eve contain 'e'
    expect(result.current.rows.length).toBeGreaterThanOrEqual(3);
  });
});

describe('useDataTable - Pagination', () => {
  it('paginates data correctly', () => {
    const props: DataTableProps<TestRow> = {
      data: mockData,
      columns: mockColumns,
      defaultPageSize: 2,
    };

    const { result } = renderHook(() => useDataTable(props));

    expect(result.current.pageRows).toHaveLength(2);
    expect(result.current.pageCount).toBe(3);
    expect(result.current.pageRows[0].name).toBe('Alice');
  });

  it('changes pages', () => {
    const props: DataTableProps<TestRow> = {
      data: mockData,
      columns: mockColumns,
      defaultPageSize: 2,
    };

    const { result } = renderHook(() => useDataTable(props));

    act(() => {
      result.current.setPagination({ pageIndex: 1, pageSize: 2 });
    });

    expect(result.current.pageRows).toHaveLength(2);
    expect(result.current.pageRows[0].name).toBe('Charlie');
  });

  it('disables pagination when enablePagination=false', () => {
    const props: DataTableProps<TestRow> = {
      data: mockData,
      columns: mockColumns,
      enablePagination: false,
    };

    const { result } = renderHook(() => useDataTable(props));

    expect(result.current.pageRows).toHaveLength(5);
    expect(result.current.pageCount).toBe(1);
  });

  it('uses rowCount in manual pagination mode', () => {
    const props: DataTableProps<TestRow> = {
      data: mockData.slice(0, 2),
      columns: mockColumns,
      manualPagination: true,
      rowCount: 100,
      defaultPageSize: 10,
    };

    const { result } = renderHook(() => useDataTable(props));

    expect(result.current.pageCount).toBe(10); // 100 / 10
  });
});

describe('useDataTable - Row Selection', () => {
  it('toggles row selection', () => {
    const props: DataTableProps<TestRow> = {
      data: mockData,
      columns: mockColumns,
      getRowId: (row) => row.id,
    };

    const { result } = renderHook(() => useDataTable(props));

    act(() => {
      result.current.toggleRowSelected('1');
    });

    expect(result.current.state.rowSelection['1']).toBe(true);
    expect(result.current.selectedRows).toHaveLength(1);

    act(() => {
      result.current.toggleRowSelected('1');
    });

    expect(result.current.state.rowSelection['1']).toBeUndefined();
    expect(result.current.selectedRows).toHaveLength(0);
  });

  it('selects multiple rows', () => {
    const props: DataTableProps<TestRow> = {
      data: mockData,
      columns: mockColumns,
      getRowId: (row) => row.id,
    };

    const { result } = renderHook(() => useDataTable(props));

    act(() => {
      result.current.toggleRowSelected('1');
      result.current.toggleRowSelected('2');
      result.current.toggleRowSelected('3');
    });

    expect(result.current.selectedRows).toHaveLength(3);
  });

  it('selects all rows', () => {
    const props: DataTableProps<TestRow> = {
      data: mockData,
      columns: mockColumns,
      getRowId: (row) => row.id,
    };

    const { result } = renderHook(() => useDataTable(props));

    act(() => {
      result.current.toggleAllRowsSelected(true);
    });

    expect(result.current.selectedRows).toHaveLength(5);
  });

  it('deselects all rows', () => {
    const props: DataTableProps<TestRow> = {
      data: mockData,
      columns: mockColumns,
      getRowId: (row) => row.id,
    };

    const { result } = renderHook(() => useDataTable(props));

    act(() => {
      result.current.toggleAllRowsSelected(true);
    });

    expect(result.current.selectedRows).toHaveLength(5);

    act(() => {
      result.current.toggleAllRowsSelected(false);
    });

    expect(result.current.selectedRows).toHaveLength(0);
  });

  it('calls onRowSelectionChange callback', () => {
    const onRowSelectionChange = vi.fn();
    const props: DataTableProps<TestRow> = {
      data: mockData,
      columns: mockColumns,
      getRowId: (row) => row.id,
      onRowSelectionChange,
    };

    const { result } = renderHook(() => useDataTable(props));

    act(() => {
      result.current.toggleRowSelected('1');
    });

    expect(onRowSelectionChange).toHaveBeenCalled();
    expect(onRowSelectionChange).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ id: '1' })])
    );
  });
});

describe('useDataTable - State Change Callback', () => {
  it('calls onStateChange when state updates', () => {
    const onStateChange = vi.fn();
    const props: DataTableProps<TestRow> = {
      data: mockData,
      columns: mockColumns,
      onStateChange,
    };

    const { result } = renderHook(() => useDataTable(props));

    act(() => {
      result.current.setGlobalFilter('test');
    });

    expect(onStateChange).toHaveBeenCalled();
  });
});

describe('useDataTable - Column Visibility', () => {
  it('sets column visibility', () => {
    const props: DataTableProps<TestRow> = {
      data: mockData,
      columns: mockColumns,
    };

    const { result } = renderHook(() => useDataTable(props));

    act(() => {
      result.current.setColumnVisibility({ name: false, age: true });
    });

    expect(result.current.state.columnVisibility).toEqual({ name: false, age: true });
  });
});
