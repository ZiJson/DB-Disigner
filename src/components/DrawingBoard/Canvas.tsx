"use client";
import { DragEndEvent, useDraggable } from "@dnd-kit/core";
import { useWorkspaceStore } from "@/providers/workspace-store-provider";
import Draggable from "../dnd/Draggable";

const canvasId = "canvas";

interface Props {
  children?: React.ReactNode;
}
const Canvas = ({ children }: Props) => {
  const position = useWorkspaceStore((state) => state.position);
  const setPosition = useWorkspaceStore((state) => state.setCanvasPosition);
  const scale = useWorkspaceStore((state) => state.scale);
  const setScale = useWorkspaceStore((state) => state.setScale);

  const { transform } = useDraggable({
    id: canvasId,
  });
  const onDragEnd = (event: DragEndEvent) => {
    if (event.active.id !== canvasId) return;
    const { x, y } = event.delta;
    setPosition({
      x: position.x + x,
      y: position.y + y,
    });
  };
  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const { x: canvasX, y: canvasY } = position;

    const { deltaY, clientX, clientY } = e;
    const scaleSize = deltaY < 0 ? 0.1 : -0.1;
    const tx = (clientX - canvasX) * scaleSize;
    const ty = (clientY - canvasY) * scaleSize;
    setScale(scale * (1 + scaleSize));
    setPosition({
      x: position.x - tx,
      y: position.y - ty,
    });
  };
  const positionStyle = {
    top: position.y,
    left: position.x,
  };
  const transformStyle = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${scale})`
      : `scale(${scale})`,
  };
  return (
    <div onWheel={onWheel} className="relative h-screen w-screen">
      <Draggable
        draggableId={canvasId}
        onDragEnd={onDragEnd}
        isTransform={false}
        className="bg-canvas absolute inset-0 h-full w-full overflow-hidden bg-background bg-[size:20px_20px]"
      >
        <div
          style={{ ...positionStyle, ...transformStyle }}
          id="canvas"
          className="absolute"
        >
          {children}
        </div>
      </Draggable>
    </div>
  );
};

export default Canvas;
