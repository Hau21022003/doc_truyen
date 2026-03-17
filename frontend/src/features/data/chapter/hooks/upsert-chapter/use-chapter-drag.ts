import {
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useState } from "react";
import { Control, useWatch } from "react-hook-form";
import { UpsertChapterInput } from "../../chapter.schema";

export function useChapterDrag(
  fields: { id: string }[],
  moveContent: (oldIdx: number, newIdx: number) => void,
  control: Control<UpsertChapterInput>,
) {
  const [activeId, setActiveId] = useState<number | string | null>(null);
  const contentsValues = useWatch({ control: control, name: "contents" }); // Sẽ truyền vào từ form

  const activeIndex = fields.findIndex((item) => item.id === activeId);
  const activeContent =
    activeIndex !== -1 ? contentsValues?.[activeIndex] : null;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      setActiveId(null);
      return;
    }

    const oldIndex = fields.findIndex((item) => item.id === active.id);
    const newIndex = fields.findIndex((item) => item.id === over.id);

    moveContent(oldIndex, newIndex);
    setActiveId(null);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  return {
    activeId,
    activeContent,
    sensors,
    handleDragStart,
    handleDragEnd,
  };
}
