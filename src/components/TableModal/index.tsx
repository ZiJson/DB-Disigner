import { type TableModal, type Field } from "@/types/Table";
import Draggable from "../dnd/Draggable";
import { useWorkspaceStore } from "@/providers/workspace-store-provider";
import { DragMoveEvent, DragStartEvent, useDraggable } from "@dnd-kit/core";
import { memo, useRef } from "react";
import { Coordinates } from "@dnd-kit/core/dist/types";
import { ColumnDef } from "@tanstack/react-table";
import { DMMF } from "@prisma/generator-helper";
import { MutableDeep } from "@/stores/TableStore";
import DataTable from "./DataTable";
interface Props {
  tableData: DMMF.Model;
}
const TableModal = ({ tableData }: Props) => {
  const startPosition = useRef<Coordinates | null>(null);
  const updateTablePosition = useWorkspaceStore(
    (state) => state.updateTablePosition,
  );
  const removeTable = useWorkspaceStore((state) => state.removeTable);
  const scale = useWorkspaceStore((state) => state.scale);
  const position = useWorkspaceStore(
    (state) => state.positions.get(tableData.name) || { x: 0, y: 0 },
  );

  const onDragMove = (event: DragMoveEvent) => {
    if (event.active.id !== tableData.name || !startPosition.current) return;
    const { x, y } = event.delta;
    updateTablePosition(tableData.name, {
      x: startPosition.current.x + x / scale,
      y: startPosition.current.y + y / scale,
    });
  };

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.id !== tableData.name) return;
    startPosition.current = position;
  };

  const onRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeTable(tableData.name);
  };
  const positionStyle = {
    top: position.y,
    left: position.x,
  };
  const { isDragging } = useDraggable({
    id: tableData.name,
  });

  return (
    <Draggable
      draggableId={tableData.name}
      isTransform={false}
      onDragMove={onDragMove}
      onDragStart={onDragStart}
    >
      <DataTable
        columns={columns}
        data={tableData.fields as MutableDeep<DMMF.Field>[]}
        title={tableData.name}
        className={`group absolute z-20 bg-card text-card-foreground transition-transform ${
          isDragging ? "scale-105 shadow-md" : ""
        }`}
        style={positionStyle}
      />
    </Draggable>
  );
};

export default memo(TableModal);

type FieldTableCol = {
  name: string;
  type: string;
};

export const columns: ColumnDef<FieldTableCol, MutableDeep<DMMF.Field>>[] = [
  {
    accessorKey: "name",
  },
  {
    accessorKey: "type",
    cell: (info) => {
      const row = info.row.original as MutableDeep<DMMF.Field>;
      return `${row.type}${row.isList ? "[]" : ""}${row.isRequired ? "" : "?"}`;
    },
  },
];
