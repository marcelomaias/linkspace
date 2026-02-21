"use client";

import { useState, useOptimistic, useTransition } from "react";
import { deleteLink, reorderLinks } from "@/lib/actions";
import LinkCard from "@/components/LinkCard";
import LinkForm from "@/components/LinkForm";
import type { Link } from "@/lib/schema";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Trash2, Plus } from "lucide-react";

type Action =
  | { type: "add"; payload: Link }
  | { type: "update"; payload: Link }
  | { type: "delete"; payload: string }
  | { type: "reorder"; payload: Link[] };

function SortableLinkCard({
  link,
  isEditing,
  isSaving,
  onEdit,
  onDelete,
  onOptimisticUpdate,
}: {
  link: Link;
  isEditing: boolean;
  isSaving: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onOptimisticUpdate: (link: Link) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const { "aria-describedby": _, ...safeAttrs } = attributes;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      {/* Drag handle */}
      <div
        {...safeAttrs}
        {...listeners}
        className="drag-handle"
        tabIndex={0}
        aria-label="Drag to reorder"
      >
        <GripVertical size={16} />
      </div>

      <LinkCard link={link} draggable />

      {/* Actions */}
      <div className="link-actions">
        <button
          onClick={onEdit}
          className="btn-icon"
          title="Edit"
          disabled={isSaving}
        >
          <Pencil size={14} />
        </button>

        <button
          onClick={onDelete}
          className="btn-icon"
          title="Delete"
          disabled={isSaving}
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Spinner */}
      {isSaving && (
        <div className="absolute right-2 bottom-2 z-30 flex items-center gap-2 text-gray-500">
          <span className="text-xs italic">saving </span>
          <div className="spinner w-4 h-4"></div>
        </div>
      )}

      {/* Edit overlay */}
      {isEditing && (
        <div className="link-edit-overlay">
          <LinkForm
            link={link}
            onOptimistic={onOptimisticUpdate}
            onSuccess={onEdit}
            onCancel={onEdit}
          />
        </div>
      )}
    </div>
  );
}

export default function LinkManager({
  initialLinks,
}: {
  initialLinks: Link[];
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [savingIds, setSavingIds] = useState<Set<string>>(new Set());

  const [isPending, startTransition] = useTransition();

  /* ---------------- Saving helpers ---------------- */

  const addSavingId = (id: string) => {
    setSavingIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const removeSavingId = (id: string) => {
    setSavingIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  /* ---------------- Optimistic state ---------------- */

  const [optimisticLinks, dispatch] = useOptimistic(
    [...initialLinks].sort((a, b) => a.order - b.order),
    (state, action: Action) => {
      switch (action.type) {
        case "add":
          return [action.payload, ...state];

        case "update":
          return state.map((l) =>
            l.id === action.payload.id ? action.payload : l,
          );

        case "delete":
          return state.filter((l) => l.id !== action.payload);

        case "reorder":
          return action.payload;

        default:
          return state;
      }
    },
  );

  /* ---------------- DnD ---------------- */

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = optimisticLinks.findIndex((l) => l.id === active.id);
    const newIndex = optimisticLinks.findIndex((l) => l.id === over.id);

    const reordered = arrayMove(optimisticLinks, oldIndex, newIndex);

    const activeId = active.id as string;

    addSavingId(activeId);

    startTransition(async () => {
      try {
        dispatch({ type: "reorder", payload: reordered });

        await reorderLinks(reordered.map((l) => l.id));
      } finally {
        removeSavingId(activeId);
      }
    });
  };

  /* ---------------- Delete ---------------- */

  const handleDelete = (id: string) => {
    if (!confirm("Delete this link?")) return;

    addSavingId(id);

    startTransition(async () => {
      try {
        dispatch({ type: "delete", payload: id });

        await deleteLink(id);
      } finally {
        removeSavingId(id);
      }
    });
  };

  /* ---------------- Render ---------------- */

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex justify-end">
        <button
          onClick={() => setIsAdding(true)}
          className="btn-primary gap-1.5"
        >
          <Plus size={16} />
          Add link
        </button>
      </div>

      {/* Add modal */}
      {isAdding && (
        <div className="modal-backdrop" onClick={() => setIsAdding(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg mb-4">New link</h3>

            <LinkForm
              onOptimistic={(link) => dispatch({ type: "add", payload: link })}
              onSuccess={() => setIsAdding(false)}
              onCancel={() => setIsAdding(false)}
            />
          </div>
        </div>
      )}

      {/* Empty */}
      {optimisticLinks.length === 0 && (
        <div className="empty-state">
          <p className="text-sm">No links yet. Add your first one!</p>
        </div>
      )}

      {/* Grid */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={optimisticLinks.map((l) => l.id)}>
          <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
            {optimisticLinks.map((link) => (
              <SortableLinkCard
                key={link.id}
                link={link}
                isEditing={editingId === link.id}
                isSaving={savingIds.has(link.id)}
                onEdit={() =>
                  setEditingId(editingId === link.id ? null : link.id)
                }
                onDelete={() => handleDelete(link.id)}
                onOptimisticUpdate={(l) =>
                  dispatch({ type: "update", payload: l })
                }
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
