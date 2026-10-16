"use client";

// Sand thrown up by the rear tyres: more with speed, a lot more when sliding
// or boosting. Feeds the shared particle pool.

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import { carState } from "../config";
import { emit } from "./pool";

const REAR = [2, 3];
const SHADES = ["#f3c08a", "#e9ad73", "#f7d3a6"];
const _at = new Vector3();
const _v = new Vector3();

export default function Dust() {
  const owed = useRef([0, 0]);

  useFrame((_, delta) => {
    const speed = Math.abs(carState.speed);
    const rate =
      Math.max(0, speed - 2.5) * 1.1 +
      Math.max(0, carState.slide - 1) * 5 +
      (carState.boosting ? 14 : 0);

    REAR.forEach((w, i) => {
      if (!carState.contact[w] || rate <= 0) {
        owed.current[i] = 0;
        return;
      }
      owed.current[i] += rate * delta;
      while (owed.current[i] >= 1) {
        owed.current[i] -= 1;
        _at.copy(carState.contactPoint[w]).setY(carState.contactPoint[w].y + 0.15);
        // kicked out behind the tyre, whichever way it is rolling
        _v.copy(carState.forward)
          .multiplyScalar(-Math.sign(carState.speed || 1) * (1 + speed * 0.12))
          .setY(0.8 + Math.random() * 1.2);
        _v.x += (Math.random() - 0.5) * 1.6;
        _v.z += (Math.random() - 0.5) * 1.6;
        emit(_at, _v, SHADES[Math.floor(Math.random() * SHADES.length)], {
          life: 0.6 + Math.random() * 0.6,
          size: 0.35 + Math.random() * 0.35 + (carState.boosting ? 0.25 : 0),
          lift: -0.6,
        });
      }
    });
  });

  return null;
}
