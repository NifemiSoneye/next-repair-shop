import { Column } from "@tanstack/react-table";
import { DebouncedInput } from "@/components/react-table/DebouncedInput";

type Props<T> = {
  column: Column<T, unknown>;
};

export default function Filter<T>({ column }: Props<T>) {
  const columnFilterValue = column.getFilterValue();
}
