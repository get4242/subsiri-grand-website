export function HeroWireMesh() {
  return <svg className="hero-wire-mesh" viewBox="0 0 720 260" preserveAspectRatio="none" aria-hidden="true">
    <g fill="none" stroke="currentColor" strokeWidth="0.65">
      {Array.from({ length: 24 }, (_, index) => {
        const startY = -18 + index * 6.3;
        const endY = 58 + index * 7.2;
        return <path key={index} d={`M-35 ${startY} C145 ${startY - 32}, 270 ${96 + index * 4.1}, 430 ${122 + index * 4.9} S610 ${endY + 20}, 755 ${endY}`}/>;
      })}
    </g>
  </svg>;
}
