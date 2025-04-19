import React, { useState, useRef, useEffect } from "react";
import plataformaImg from "../assets/plataforma.png";
import plataformaMovilImg from "../assets/plataforma_movil.png";
import cafeImg from "../assets/cafe.png";
import estalactitaImg from "../assets/estalactita.png";

const GRID_SIZE = 10;

const imageMap: Record<string, string> = {
  plataforma: plataformaImg,
  plataforma_movil: plataformaMovilImg,
  cafe: cafeImg,
  estalactita: estalactitaImg,
};

interface DraggableBoxProps {
  id: number;
  type: "platform" | "mobile_platform" | "coffee" | "stalactite";
  areaRef: React.RefObject<HTMLDivElement>;
  onPositionChange: (id: number, position: { x: number; y: number }) => void;
  onRemove: (id: number) => void;
  width: number;
  height: number;
}

function DraggableBox({
  areaRef,
  id,
  onPositionChange,
  type,
  onRemove,
  width,
  height,
}: DraggableBoxProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    onPositionChange(id, position);
  }, []);

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDragging.current = true;
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging.current || !areaRef.current) return;

    const rect = areaRef.current.getBoundingClientRect();
    const newX = e.clientX - offset.current.x;
    const newY = e.clientY - offset.current.y;

    const snappedX = Math.round(newX / GRID_SIZE) * GRID_SIZE;
    const snappedY = Math.round(newY / GRID_SIZE) * GRID_SIZE;

    const clampedX = Math.max(0, Math.min(snappedX, rect.width - width));
    const clampedY = Math.max(0, Math.min(snappedY, rect.height - height));

    setPosition({ x: clampedX, y: clampedY });
    onPositionChange(id, { x: clampedX, y: clampedY });
  };

  const onMouseUp = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return (
    <div
      onMouseDown={onMouseDown}
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        cursor: "grab",
        width,
        height,
        zIndex: 1,
      }}
    >
      <img
        src={imageMap[type]}
        alt={type}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "fill",
          pointerEvents: "none",
        }}
      />
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(id);
        }}
        style={{
          position: "absolute",
          top: -10,
          right: -10,
          background: "red",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "20px",
          height: "20px",
          fontSize: "12px",
          cursor: "pointer",
          zIndex: 2,
        }}
      >
        ×
      </button>
    </div>
  );
}

export default DraggableBox;
