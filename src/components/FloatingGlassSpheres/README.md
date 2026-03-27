# FloatingGlassSpheres

`FloatingGlassSpheres` is an isolated, non-destructive background effect with a defensive entry component.

## Files

- `FloatingGlassSpheres.tsx`: Safe entrypoint that checks for WebGL + low-end/mobile constraints and lazy-loads the 3D renderer.
- `FloatingGlassSpheresR3F.tsx`: React Three Fiber scene (5 low-poly glass spheres with gentle float, rotation, and pointer parallax).
- `FloatingGlassSpheres.css`: Shared root styles and CSS-only fallback.

## Integration

Render once near the application shell/root layout, behind content:

```tsx
<FloatingGlassSpheres />
```

The root element is `position: fixed` and `pointer-events: none`, so normal interaction is unaffected.

The entry component is a client component (`'use client'`) because it relies on runtime browser capability checks (`WebGL`, `matchMedia`, memory/CPU/network hints).

## Dependencies

This feature expects:

- `three`
- `@react-three/fiber` (use `^9.x` with React 19 projects)

If dynamic import fails (or WebGL is unsupported), the CSS fallback remains active.

## Performance Notes

- DPR is clamped to `1.5`.
- Sphere count defaults to 5.
- Geometry is low-poly (`icosahedronGeometry`, detail `2`).
- Mobile/low-end devices use CSS fallback by default.
- Suspense keeps the CSS fallback visible while the 3D chunk loads.


## React 19 Compatibility

This repository currently uses `react@19`, so keep `@react-three/fiber` on the `9.x` major line to avoid peer dependency conflicts during install/deploy.
