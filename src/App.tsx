import { useState, useRef } from "react";
import DraggableBox from "./components/DraggableBox";

type ShapeType = "platform" | "mobile_platform" | "coffee" | "stalactite";

const GRID_SIZE = 50;

interface Shape {
  id: number;
  type: ShapeType;
  direccion?: number;
  velocidad?: number;
}

function App() {
  const [width, setWidth] = useState(4000);
  const [height, setHeight] = useState(500);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [positions, setPositions] = useState<
    Record<number, { x: number; y: number }>
  >({});
  const areaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [selectedType, setSelectedType] = useState<ShapeType>("platform");

  // Tamaños por tipo
  const [shapeSizes, setShapeSizes] = useState<
    Record<ShapeType, { width: number; height: number }>
  >({
    platform: { width: 200, height: 100 },
    mobile_platform: { width: 400, height: 100 },
    coffee: { width: 34, height: 21 },
    stalactite: { width: 50, height: 124 },
  });

  const [direccion, setDireccion] = useState(1); // 0 o 1
  const [velocidad, setVelocidad] = useState(2); // valor numérico

  const handleRemoveShape = (id: number) => {
    setShapes((prev) => prev.filter((s) => s.id !== id));
    setPositions((prev) => {
      const newPositions = { ...prev };
      delete newPositions[id];
      return newPositions;
    });
  };

  const handlePositionChange = (id: number, pos: { x: number; y: number }) => {
    setPositions((prev) => ({ ...prev, [id]: pos }));
  };

  const addShape = () => {
    setShapes((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        type: selectedType,
        ...(selectedType === "mobile_platform" && {
          direccion,
          velocidad,
        }),
      },
    ]);
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        background: "#23272e",
        minHeight: "100vh",
        height: "100%",
        color: "#ffffff",
        padding: "2rem",
      }}
    >
      <div
        style={{
          margin: "auto",
          fontFamily: "sans-serif",
          paddingBottom: "1rem",
          display: "flex",
          flexDirection: "row",
          gap: "5rem"
        }}
      >
        <div>
          <h2 style={{ marginBottom: "1.2rem" }}>Área interactiva</h2>

          {/* Tamaño del área */}
          <div
            style={{ display: "flex", gap: "1.5rem", marginBottom: "1.5rem" }}
          >
            <label style={{ flex: 1 }}>
              Ancho:
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                style={{
                  marginLeft: 8,
                  padding: "6px",
                  width: "100%",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
            </label>
            <label style={{ flex: 1 }}>
              Alto:
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                style={{
                  marginLeft: 8,
                  padding: "6px",
                  width: "100%",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
            </label>
          </div>

          {/* Tipo de figura */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                fontWeight: "bold",
                display: "block",
                marginBottom: "0.5rem",
              }}
            >
              Tipo de figura:
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
              {(
                [
                  "platform",
                  "mobile_platform",
                  "coffee",
                  "stalactite",
                ] as ShapeType[]
              ).map((type) => (
                <label
                  key={type}
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <input
                    type="radio"
                    name="shape"
                    value={type}
                    checked={selectedType === type}
                    onChange={() => setSelectedType(type)}
                  />
                  {type.replace("_", " ")}
                </label>
              ))}
            </div>
          </div>

          {/* Tamaños por tipo */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h4 style={{ marginBottom: "0.5rem" }}>Tamaños por tipo:</h4>
            {(Object.keys(shapeSizes) as ShapeType[]).map((type) => (
              <div key={type} style={{ marginBottom: "0.75rem" }}>
                <strong>{type.replaceAll("_", " ")}:</strong>{" "}
                <label style={{ marginRight: "1rem" }}>
                  Ancho:
                  <input
                    type="number"
                    value={shapeSizes[type].width}
                    onChange={(e) =>
                      setShapeSizes((prev) => ({
                        ...prev,
                        [type]: {
                          ...prev[type],
                          width: Number(e.target.value),
                        },
                      }))
                    }
                    style={{
                      marginLeft: 6,
                      padding: "4px 6px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      width: "60px",
                    }}
                  />
                </label>
                <label>
                  Alto:
                  <input
                    type="number"
                    value={shapeSizes[type].height}
                    onChange={(e) =>
                      setShapeSizes((prev) => ({
                        ...prev,
                        [type]: {
                          ...prev[type],
                          height: Number(e.target.value),
                        },
                      }))
                    }
                    style={{
                      marginLeft: 6,
                      padding: "4px 6px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      width: "60px",
                    }}
                  />
                </label>
              </div>
            ))}
          </div>

          {/* Datos adicionales para plataforma_movil */}
          {selectedType === "mobile_platform" && (
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ marginRight: "1.5rem" }}>
                Dirección:
                <select
                  value={direccion}
                  onChange={(e) => setDireccion(Number(e.target.value))}
                  style={{
                    marginLeft: 8,
                    padding: "6px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                >
                  <option value={-1}>Izquierda</option>
                  <option value={1}>Derecha</option>
                </select>
              </label>

              <label>
                Velocidad:
                <input
                  type="number"
                  value={velocidad}
                  onChange={(e) => setVelocidad(Number(e.target.value))}
                  style={{
                    marginLeft: 8,
                    padding: "6px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    width: "80px",
                  }}
                />
              </label>
            </div>
          )}

          {/* Botón */}
          <button
            onClick={addShape}
            style={{
              padding: "10px 20px",
              background: "#2ecc71",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontWeight: "bold",
              fontSize: "1rem",
              cursor: "pointer",
              transition: "background 0.3s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#27ae60")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#2ecc71")}
          >
            ➕ Agregar Objeto
          </button>
        </div>
        <div>
          <div
            style={{
              lineHeight: 1.6,
              maxHeight: "25rem",
              overflow: "auto",   
            }}
          >
            <h2
              style={{
                fontSize: "1.5rem",
                marginBottom: "1rem",
              }}
            >
              🛠️ Instrucciones de uso
            </h2>
            <p>
              Esta herramienta permite diseñar un nivel interactivo agregando
              distintos tipos de objetos con posiciones personalizadas. Puedes
              usarla para construir escenarios y exportar sus datos en formato
              JSON.
            </p>

            <p>
              Las medidas que estan por defecto hacen referencia al tamño de los objetos en Godot. estas medidas estan en centimetros.
            </p>

            <p>
              Cada cuadrito en el grid mide 50cm o 0.5m.
            </p>

            <h3 style={{ marginTop: "1rem" }}>
              📏 Parámetros generales
            </h3>
            <ul style={{ paddingLeft: "1.2rem" }}>
              <li>
                <strong>Ancho / Alto:</strong> Define el tamaño del área de
                diseño en píxeles.
              </li>
              <li>
                <strong>Tipo de figura:</strong> Selecciona qué tipo de objeto
                deseas agregar:
                <ul style={{ paddingLeft: "1rem" }}>
                  <li>
                    <code>plataforma</code>: Elemento estático.
                  </li>
                  <li>
                    <code>plataforma movil</code>: Se mueve horizontalmente.
                  </li>
                  <li>
                    <code>cafe</code>: Posible recolectable u objeto decorativo.
                  </li>
                  <li>
                    <code>estalactita</code>: Objeto que probablemente cae o
                    decora.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Tamaños por tipo:</strong> Permite definir el tamaño
                predeterminado para cada figura.
              </li>
            </ul>

            <h3 style={{ marginTop: "1rem" }}>
              ⚙️ Opciones específicas
            </h3>
            <ul style={{ paddingLeft: "1.2rem" }}>
              <li>
                <strong>Dirección (solo para plataforma movil):</strong> Indica
                hacia dónde se moverá:
                <ul style={{ paddingLeft: "1rem" }}>
                  <li>
                    <code>-1</code>: Desde el punto en el que pone empiza su movimiento hacia la izquierda
                  </li>
                  <li>
                    <code>1</code>: Desde el punto en el que pone empiza su movimiento hacia la derecha
                  </li>
                </ul>
              </li>
              <li>
                <strong>Velocidad:</strong> Valor numérico que define qué tan
                rápido se mueve una plataforma móvil.
              </li>
            </ul>

            <h3 style={{ marginTop: "1rem" }}>
              📝 Resultado exportado
            </h3>
            <p>
              La sección de "Posiciones de los objetos" muestra un objeto JSON
              organizado por tipo de figura. Cada figura tiene sus coordenadas:
            </p>
            <ul style={{ paddingLeft: "1.2rem" }}>
              <li>
                <code>x</code>: Posición horizontal (centrada), medida en
                unidades (100px = 1 unidad).
              </li>
              <li>
                <code>y</code>: Posición vertical (centrada), desde la base
                hacia arriba.
              </li>
              <li>
                <code>direccion</code> y <code>velocidad</code> solo aparecen si
                aplica.
              </li>
            </ul>

            <p style={{ marginTop: "1rem" }}>
              Puedes copiar el resultado usando el botón de{" "}
              <strong>Copiar</strong> y usarlo directamente en tu motor o lógica
              de juego.
            </p>
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: "100%",
          overflow: "auto",
          border: "2px solid #aaa",
          borderRadius: "8px",
          marginBottom: "1rem",
        }}
      >
        <div
          ref={areaRef}
          style={{
            position: "relative",
            width: `${width}px`,
            height: `${height}px`,
            border: "1px solid black",
            backgroundImage: `linear-gradient(to right, rgb(97, 97, 97) 1px, transparent 1px),
                        linear-gradient(to bottom, rgb(97, 97, 97) 1px, transparent 1px)`,
            backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
            backgroundColor: "#808080",
          }}
        >
          {shapes.map(({ id, type }) => (
            <DraggableBox
              key={id}
              id={id}
              type={type}
              areaRef={areaRef}
              onPositionChange={handlePositionChange}
              onRemove={handleRemoveShape}
              width={shapeSizes[type].width}
              height={shapeSizes[type].height}
            />
          ))}
        </div>
      </div>

      <h3 style={{ marginTop: "2rem", fontSize: "1.25rem", fontWeight: 600 }}>
        Posiciones de los objetos
      </h3>

      <div
        style={{
          position: "relative",
          width: "80%",
          marginTop: "1rem",
        }}
      >
        <textarea
          readOnly
          ref={textareaRef}
          style={{
            width: "100%",
            height: "200px",
            fontFamily: "monospace",
            padding: "1rem",
            borderRadius: "8px",
            background: "#f8f8f8",
            resize: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            backgroundColor: "#2c3e50",
            fontWeight: "bold",
            color: "#ecf0f1",
            lineHeight: "1.5",
          }}
          value={JSON.stringify(
            shapes.reduce((acc, shape) => {
              const pos = positions[shape.id];
              if (pos) {
                const size = shapeSizes[shape.type];

                if (!acc[shape.type]) acc[shape.type] = [];

                const baseData = {
                  x: (pos.x + size.width / 2) / 100,
                  y: (height - pos.y - size.height / 2) / 100,
                };

                const extraData =
                  shape.type === "mobile_platform"
                    ? {
                        direccion: shape.direccion ?? 1,
                        velocidad: shape.velocidad ?? 2,
                      }
                    : {};

                acc[shape.type].push({
                  ...baseData,
                  ...extraData,
                });
              }
              return acc;
            }, {} as Record<string, any[]>),
            null,
            2
          )}
        ></textarea>

        <button
          onClick={() => {
            if (textareaRef.current) {
              textareaRef.current.select();
              document.execCommand("copy");
            }
          }}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            backgroundColor: "#3498db",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            padding: "6px 12px",
            cursor: "pointer",
            fontSize: "0.875rem",
          }}
        >
          Copiar
        </button>
      </div>
    </div>
  );
}

export default App;
