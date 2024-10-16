import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"; // Adjust the import according to your directory structure
import { fetchPredictions } from "@/lib/actions/predictions.actions"; // Adjust the import according to your directory structure
import { currentUser } from "@clerk/nextjs/server";

// Define a type for the optimal order
type OptimalOrder = {
  [key: string]: number; // Category name as key and amount as value
};

const PredictionsTable = async () => {
  const user = await currentUser(); // Get the current user's ID from Clerk
  const userId = user?.id;

  if (!userId) {
    return (
      <div className="p-4 text-red-500">Error: User not authenticated</div>
    ); // Handle case where userId is not available
  }

  try {
    // Fetch predictions data
    const predictionData = await fetchPredictions(userId);
    const optimalOrder: OptimalOrder | undefined = predictionData?.optimalOrder;

    // Convert the optimal order object into an array of entries for easy mapping
    const dataEntries = optimalOrder
      ? Object.entries(optimalOrder).map(([category, amount]) => ({
          category,
          amount,
        }))
      : [];

    return (
      <div className="rounded-lg overflow-hidden shadow-md bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="bg-gray-100" style={{ color: "#f87315" }}>
                Category
              </TableHead>
              <TableHead className="bg-gray-100" style={{ color: "#f87315" }}>
                Amount
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataEntries.length > 0 ? (
              dataEntries.map(({ category, amount }) => (
                <TableRow key={category}>
                  <TableCell className="border-b">{category}</TableCell>
                  <TableCell className="border-b">{amount}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} className="text-center">
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    );
  } catch (error: any) {
    return <div className="p-4 text-red-500">Error: {error.message}</div>;
  }
};

export default PredictionsTable;
