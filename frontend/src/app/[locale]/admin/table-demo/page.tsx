"use client";
import { Button } from "@/components/ui/button";
import { TableColumnConfigMap, useTableState } from "@/features/table";
import {
  DataTable,
  ExtraColumnConfig,
} from "@/features/table/components/data-table";
import { useMemo } from "react";

// Mock data types
interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user" | "moderator";
  avatar: string;
  createdAt: string;
  lastLogin: string;
  status: "active" | "inactive" | "pending";
}

// Generate mock data
const generateMockUsers = (): User[] => {
  const roles: User["role"][] = ["admin", "user", "moderator"];
  const statuses: User["status"][] = ["active", "inactive", "pending"];

  return Array.from({ length: 150 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: roles[Math.floor(Math.random() * roles.length)],
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=user${i + 1}`,
    createdAt: new Date(
      Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000,
    ).toISOString(),
    lastLogin: new Date(
      Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000,
    ).toISOString(),
    status: statuses[Math.floor(Math.random() * statuses.length)],
  }));
};

export default function TableDemoPage() {
  const mockUsers = useMemo(() => generateMockUsers(), []);

  // Column configuration
  const config: TableColumnConfigMap<
    "id" | "name" | "email" | "role" | "status" | "createdAt" | "lastLogin",
    User
  > = {
    id: {
      label: "ID",
      defaultVisible: true,
      width: 70,
      resizable: false,
      accessor: (row) => row.id,
    },
    name: {
      label: "Name",
      defaultVisible: true,
      // width: 100,
      resizable: true,
      align: "right",
      accessor: (row) => row.name,
      renderHeader: () => (
        <div className="flex items-center justify-end">
          <img src="/icons/user.svg" alt="User Icon" className="w-4 h-4 mr-2" />
          <span>Name</span>
        </div>
      ),
      // render: (row) => (
      //   <div>
      //     <div className="flex items-center gap-2">
      //       <img
      //         src={row.avatar}
      //         alt={row.name}
      //         className="w-8 h-8 rounded-full"
      //       />
      //       <span>{row.name}</span>
      //     </div>
      //     <span>{row.name}</span>
      //   </div>
      // ),
    },
    email: {
      label: "Email",
      defaultVisible: true,
      width: 250,
      resizable: true,
      sortable: true,
      align: "center",
      accessor: (row) => row.email,
    },
    role: {
      label: "Role",
      defaultVisible: true,
      width: 120,
      resizable: true,
      accessor: (row) => row.role,
      // format: (value) => {
      //   const config = {
      //     admin: { bg: "bg-red-100 text-red-800", label: "Admin" },
      //     moderator: { bg: "bg-blue-100 text-blue-800", label: "Mod" },
      //     user: { bg: "bg-gray-100 text-gray-800", label: "User" },
      //   };
      //   const { bg, label } = config[value as keyof typeof config];
      //   return (
      //     <span className={`px-2 py-1 rounded-full text-xs ${bg}`}>
      //       {label}
      //     </span>
      //   );
      // },
    },
    status: {
      label: "Status",
      defaultVisible: true,
      width: 100,
      resizable: true,
      accessor: (row) => row.status,
      // format: (value) => {
      //   const config = {
      //     active: { bg: "bg-green-100 text-green-800", label: "Active" },
      //     inactive: { bg: "bg-gray-100 text-gray-800", label: "Inactive" },
      //     pending: { bg: "bg-yellow-100 text-yellow-800", label: "Pending" },
      //   };
      //   const { bg, label } = config[value as keyof typeof config];
      //   return (
      //     <span className={`px-2 py-1 rounded-full text-xs ${bg}`}>
      //       {label}
      //     </span>
      //   );
      // },
    },
    createdAt: {
      label: "Created",
      defaultVisible: true,
      width: 150,
      resizable: true,
      sortable: true,
      accessor: (row) => row.createdAt,
      format: (value) => new Date(value).toLocaleDateString(),
    },
    lastLogin: {
      label: "Last Login",
      defaultVisible: true,
      width: 150,
      resizable: true,
      accessor: (row) => row.lastLogin,
      format: (value) => new Date(value).toLocaleDateString(),
    },
  };

  const handleEdit = (user: User) => {
    alert(`Edit user: ${user.name}`);
  };

  const handleDelete = (userId: number) => {
    alert(`Delete user with ID: ${userId}`);
  };

  const extraColumns: ExtraColumnConfig<User>[] = [
    {
      key: "actions",
      width: 150,
      align: "center",
      sticky: "right",
      label: "Actions",
      render: (user, index) => (
        <div className="flex gap-2">
          <Button size="sm" onClick={() => handleEdit(user)}>
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDelete(user.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
    {
      key: "status",
      width: 80,
      align: "center",
      sticky: "left",
      label: "Status",
      render: (user) => (
        <span
          className={`inline-block w-2 h-2 rounded-full ${
            user.status ? "bg-green-500" : "bg-gray-400"
          }`}
        />
      ),
    },
  ];

  // Table state management
  const tableState = useTableState(config, {
    persistKey: "demo-table",
    defaultPageSize: 10,
  });

  // Pagination
  const { page, pageSize } = tableState.pagination;
  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return mockUsers.slice(startIndex, endIndex);
  }, [mockUsers, page, pageSize]);

  return (
    <div className="p-6 relative">
      <h1 className="text-2xl font-bold mb-4">Table Demo</h1>

      <DataTable
        data={paginatedData}
        totalCount={mockUsers.length}
        tableState={tableState}
        extraColumns={extraColumns}
      />
    </div>
  );
}
