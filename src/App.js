import "./styles.css";
import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i) => {
    const delay = 0.5 + i * 0.5;
    return {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { delay, type: "spring", duration: 1.5, bounce: 0 },
        opacity: { delay, duration: 0.01 },
      },
    };
  },
};

export default function App() {
  const [startAnimation, setStartAnimation] = useState(false);
  const [lineData, setLineData] = useState(null);

  const div1Ref = useRef(null);
  const div2Ref = useRef(null);

  useEffect(() => {
    if (div1Ref.current && div2Ref.current) {
      const div1Rect = div1Ref.current.getBoundingClientRect();
      const div2Rect = div2Ref.current.getBoundingClientRect();

      // Obtener las coordenadas absolutas de los divs
      const startX = div1Rect.right - div1Ref.current.clientLeft; // Ajuste para eliminar el posible margen
      const startY = div1Rect.top + div1Rect.height / 2;
      const endX = div2Rect.left - div2Ref.current.clientLeft; // Ajuste para eliminar el posible margen
      const endY = div2Rect.top + div2Rect.height / 2;

      // Calcular la posición intermedia para la línea vertical
      const midX = (startX + endX) / 2;

      setLineData({
        startX,
        startY,
        midX,
        endX,
        endY,
      });
    }
  }, [startAnimation]);

  const handleClick = () => {
    setStartAnimation(true);
  };

  return (
    <div className="container">
      <div id="div1" ref={div1Ref} className="box" onClick={handleClick}></div>
      <div id="div2" ref={div2Ref} className="box lower"></div>

      {startAnimation && lineData && (
        <motion.svg
          className="svg-container"
          width="100%"
          height="100%"
          initial="hidden"
          animate="visible"
        >
          {/* Línea horizontal desde el borde derecho del primer div */}
          <motion.line
            x1={lineData.startX}
            y1={lineData.startY}
            x2={lineData.midX}
            y2={lineData.startY}
            stroke="#00cc88"
            strokeWidth="2"
            variants={draw}
            custom={0}
          />
          {/* Línea vertical que conecta ambas líneas horizontales */}
          <motion.line
            x1={lineData.midX}
            y1={lineData.startY}
            x2={lineData.midX}
            y2={lineData.endY}
            stroke="#00cc88"
            strokeWidth="2"
            variants={draw}
            custom={1}
          />
          {/* Línea horizontal desde la línea vertical hasta el segundo div */}
          <motion.line
            x1={lineData.midX}
            y1={lineData.endY}
            x2={lineData.endX}
            y2={lineData.endY}
            stroke="#00cc88"
            strokeWidth="2"
            variants={draw}
            custom={2}
          />
        </motion.svg>
      )}
    </div>
  );
}
