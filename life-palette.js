(function attachLifePalette(global) {
  function hashSeed(value) {
    let hash = 2166136261;
    for (let index = 0; index < value.length; index += 1) {
      hash ^= value.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function random(seed) {
    let value = seed >>> 0;
    return () => {
      value += 0x6d2b79f5;
      let result = value;
      result = Math.imul(result ^ (result >>> 15), result | 1);
      result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
      return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
    };
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function localize(value) {
    return global.EmotionIslandI18n?.translate(value) ?? value;
  }

  function localizedCount(count) {
    return global.EmotionIslandI18n?.t(count === 1 ? "count.day" : "count.days", { count }) || `${count}天`;
  }

  function rgba(hex, alpha) {
    const value = hex.replace("#", "");
    const normalized = value.length === 3 ? value.split("").map((char) => char + char).join("") : value;
    const red = Number.parseInt(normalized.slice(0, 2), 16);
    const green = Number.parseInt(normalized.slice(2, 4), 16);
    const blue = Number.parseInt(normalized.slice(4, 6), 16);
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  }

  function paletteHeightFor(itemCount, width) {
    if (!itemCount) return 280;
    const compact = width < 480;
    if (itemCount <= 2) return compact ? 320 : 300;
    if (itemCount <= 5) return compact ? 390 : 350;
    if (itemCount <= 8) return compact ? 480 : 410;
    const extraRows = Math.ceil((itemCount - 8) / (compact ? 3 : 4));
    return (compact ? 480 : 410) + extraRows * (compact ? 100 : 86);
  }

  function makeIslandPath(width, height, seed, scale = 1, offsetX = 0, offsetY = 0) {
    const next = random(seed);
    const pointCount = 20;
    const centerX = width * 0.5 + offsetX;
    const centerY = height * 0.52 + offsetY;
    const radiusX = width * 0.47 * scale;
    const radiusY = height * 0.43 * scale;
    const points = [];

    for (let index = 0; index < pointCount; index += 1) {
      const angle = (Math.PI * 2 * index) / pointCount - Math.PI * 0.5;
      const broadWobble = Math.sin(index * 1.63 + seed) * 0.035;
      const wobble = 0.88 + next() * 0.16 + broadWobble;
      points.push({
        x: centerX + Math.cos(angle) * radiusX * wobble,
        y: centerY + Math.sin(angle) * radiusY * wobble,
      });
    }

    const midpoint = (left, right) => ({
      x: (left.x + right.x) * 0.5,
      y: (left.y + right.y) * 0.5,
    });
    const path = new Path2D();
    const firstMidpoint = midpoint(points[0], points[1]);
    path.moveTo(firstMidpoint.x, firstMidpoint.y);
    for (let index = 0; index < pointCount; index += 1) {
      const point = points[index];
      const nextPoint = points[(index + 1) % pointCount];
      const nextMidpoint = midpoint(point, nextPoint);
      path.quadraticCurveTo(point.x, point.y, nextMidpoint.x, nextMidpoint.y);
    }
    path.closePath();
    return path;
  }

  function layoutItems(items, width, height) {
    const fallbackAnchors = [
      [0.24, 0.36],
      [0.46, 0.28],
      [0.68, 0.36],
      [0.77, 0.58],
      [0.57, 0.7],
      [0.34, 0.72],
      [0.18, 0.58],
      [0.44, 0.5],
      [0.66, 0.52],
      [0.3, 0.48],
      [0.8, 0.7],
      [0.12, 0.3],
    ];
    const familyAnchors = {
      work: [0.25, 0.44],
      home: [0.48, 0.48],
      family: [0.53, 0.54],
      travel: [0.48, 0.32],
      nature: [0.65, 0.48],
      social: [0.62, 0.62],
      learning: [0.36, 0.66],
      food: [0.5, 0.7],
      drink: [0.58, 0.38],
      leisure: [0.28, 0.58],
      direction: [0.5, 0.42],
      conflict: [0.2, 0.46],
      health: [0.22, 0.62],
      boredom: [0.33, 0.3],
      melancholy: [0.24, 0.5],
      shadow: [0.18, 0.42],
      wind: [0.58, 0.28],
      low: [0.3, 0.64],
      bright: [0.62, 0.34],
      calm: [0.5, 0.3],
      storm: [0.42, 0.62],
      irritable: [0.74, 0.24],
    };
    const spreadDirections = {
      work: [0.98, 0.05],
      home: [0.72, -0.18],
      family: [0.62, 0.38],
      travel: [-0.82, -0.12],
      nature: [0.32, -0.82],
      social: [0.66, 0.48],
      learning: [-0.5, 0.62],
      food: [0.1, 0.86],
      drink: [0.64, -0.28],
      leisure: [-0.58, 0.36],
      direction: [0.76, -0.18],
      conflict: [-0.86, 0.12],
      health: [-0.56, 0.48],
      boredom: [-0.42, -0.62],
      melancholy: [-0.76, 0.2],
      shadow: [-0.7, -0.32],
      wind: [0.48, -0.72],
      low: [-0.18, 0.78],
      bright: [0.76, -0.24],
      calm: [0.1, -0.72],
      storm: [-0.2, 0.72],
      irritable: [0.84, -0.18],
    };
    const totalCount = items.reduce((sum, item) => sum + item.count, 0);
    const recordedDays = items.reduce((largest, item) => Math.max(largest, item.recordedDays || 0), 0);
    const coverage = clamp(recordedDays / 30, 0, 1);
    const fillProgress = Math.pow(coverage, 0.72);
    const unit = Math.min(width, height);
    const laidOut = items.map((item, index) => {
      const seed = hashSeed(item.key);
      const next = random(seed);
      const anchor = familyAnchors[item.family] || fallbackAnchors[index % fallbackAnchors.length];
      const direction = spreadDirections[item.family] || [0, 1];
      const share = totalCount ? item.count / totalCount : 0;
      const dominantByDays = clamp((item.count - 15) / 15, 0, 1);
      const dominantByShare = clamp((share - 0.3) / 0.4, 0, 1);
      const dominant = Math.max(dominantByDays, dominantByShare);
      // The center remains count-driven. Month coverage is carried by the
      // transparent watercolor fringe, so a one-day trace stays visibly small.
      const effectiveCount = Math.min(item.count, 10);
      const radius = clamp(
        unit * (0.018 + 0.032 * Math.pow(effectiveCount, 0.9)),
        unit * 0.035,
        unit * 0.24,
      );
      const jitterX = (next() - 0.5) * Math.min(22, width * 0.04);
      const jitterY = (next() - 0.5) * Math.min(18, height * 0.04);
      const desiredX = clamp(width * anchor[0] + jitterX, width * 0.1, width * 0.9);
      const desiredY = clamp(height * anchor[1] + jitterY, height * 0.1, height * 0.9);
      const rotation = Math.atan2(direction[1], direction[0]) + (next() - 0.5) * 0.18;
      const paintRotation = rotation + (random(seed + 901)() - 0.5) * 0.1;
      const massPressure = clamp((item.count - 2) / 13, 0, 1);
      const paintScale = 1.42 + fillProgress * 1.08;
      const stretchX = 1 + dominant * (0.56 + Math.abs(direction[0]) * 0.48);
      const stretchY = 0.94 + dominant * (0.18 + Math.abs(direction[1]) * 0.22);
      const massFootprint = radius * (1.05 + massPressure * 1.7 + dominant * 0.55);
      const paintFootprint = radius * paintScale * Math.max(stretchX, stretchY) * 0.72;
      const layoutRadius = Math.min(
        unit * 0.48,
        Math.max(massFootprint, paintFootprint),
      );
      return {
        ...item,
        x: desiredX,
        y: desiredY,
        desiredX,
        desiredY,
        radius,
        layoutRadius,
        layoutMass: Math.pow(Math.max(item.count, 1), 0.68),
        seed,
        share,
        dominant,
        directionX: direction[0],
        directionY: direction[1],
        rotation,
        paintRotation,
        coverageProgress: fillProgress,
        paintScale,
        stretchX,
        stretchY,
      };
    });

    // Reflow the whole composition after sizing the drops. Large traces have
    // more visual mass, so nearby smaller traces move first instead of being
    // hidden underneath them. The attraction back to each semantic anchor
    // keeps the result organic rather than turning into a generic grid.
    for (let pass = 0; pass < 44; pass += 1) {
      for (let leftIndex = 0; leftIndex < laidOut.length; leftIndex += 1) {
        for (let rightIndex = leftIndex + 1; rightIndex < laidOut.length; rightIndex += 1) {
          const left = laidOut[leftIndex];
          const right = laidOut[rightIndex];
          let dx = right.x - left.x;
          let dy = right.y - left.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (!distance) {
            const angle = ((leftIndex * 17 + rightIndex * 31) % 360) * (Math.PI / 180);
            dx = Math.cos(angle) * 0.001;
            dy = Math.sin(angle) * 0.001;
            distance = 0.001;
          }
          const minimumDistance = Math.max(18, (left.layoutRadius + right.layoutRadius) * 0.84);
          if (distance >= minimumDistance) continue;
          const overlap = (minimumDistance - distance) * 0.42;
          const leftMobility = 1 / (1 + left.layoutMass * 0.18);
          const rightMobility = 1 / (1 + right.layoutMass * 0.18);
          const mobilityTotal = leftMobility + rightMobility;
          const leftShare = leftMobility / mobilityTotal;
          const rightShare = rightMobility / mobilityTotal;
          left.x -= (dx / distance) * overlap * leftShare;
          left.y -= (dy / distance) * overlap * leftShare;
          right.x += (dx / distance) * overlap * rightShare;
          right.y += (dy / distance) * overlap * rightShare;
        }
      }
      laidOut.forEach((item) => {
        const anchorPull = 0.045 + (1 - clamp(item.layoutMass / 10, 0, 1)) * 0.018;
        item.x += (item.desiredX - item.x) * anchorPull;
        item.y += (item.desiredY - item.y) * anchorPull;
        const edgePaddingX = width * 0.075 + item.layoutRadius * 0.22;
        const edgePaddingY = height * 0.09 + item.layoutRadius * 0.22;
        item.x = clamp(item.x, edgePaddingX, width - edgePaddingX);
        item.y = clamp(item.y, edgePaddingY, height - edgePaddingY);
      });
    }

    // Collision resolution moves the visual center. Recompute the pigment
    // focus afterwards so the label travels with the actual deepest color.
    laidOut.forEach((item) => {
      const jitter = random(item.seed + 3301);
      const coreX = item.x + (jitter() - 0.5) * item.radius * 0.035;
      const coreY = item.y + (jitter() - 0.5) * item.radius * 0.035;
      item.coreX = coreX;
      item.coreY = coreY;
    });

    return laidOut;
  }

  function drawField(ctx, width, height, items) {
    const islandColor = "#fff7df";
    const edgeRandom = random(1871);

    // The monthly traces sit on a painted island, not on a rectangular card.
    // Several offset cream washes keep the coastline irregular and soft.
    for (let layer = 0; layer < 4; layer += 1) {
      const spread = 1.025 + layer * 0.012;
      const wash = makeIslandPath(
        width,
        height,
        1871 + layer * 31,
        spread,
        (edgeRandom() - 0.5) * width * 0.018,
        (edgeRandom() - 0.5) * height * 0.018,
      );
      ctx.save();
      ctx.globalAlpha = 0.16 - layer * 0.025;
      ctx.filter = `blur(${5.5 - layer * 0.8}px)`;
      ctx.fillStyle = islandColor;
      ctx.fill(wash);
      ctx.restore();
    }

    const island = makeIslandPath(width, height, 1987, 0.99);
    ctx.save();
    ctx.globalAlpha = 0.97;
    ctx.filter = "blur(0.45px)";
    ctx.fillStyle = islandColor;
    ctx.fill(island);
    ctx.restore();

    if (items.length > 1) {
      const centerX = items.reduce((sum, item) => sum + item.x, 0) / items.length;
      const centerY = items.reduce((sum, item) => sum + item.y, 0) / items.length;
      const radius = Math.min(width, height) * 0.38;
      const atmosphere = ctx.createRadialGradient(centerX, centerY, radius * 0.05, centerX, centerY, radius);
      atmosphere.addColorStop(0, "rgba(249, 209, 126, 0.035)");
      atmosphere.addColorStop(0.68, "rgba(249, 209, 126, 0.012)");
      atmosphere.addColorStop(1, "rgba(249, 209, 126, 0)");
      ctx.save();
      ctx.fillStyle = atmosphere;
      ctx.fill(island);
      ctx.restore();
    }
    return island;
  }

  function makePigmentPath(centerX, centerY, radiusX, radiusY, rotation, seed) {
    const next = random(seed);
    const pointCount = 18;
    const points = [];
    for (let index = 0; index < pointCount; index += 1) {
      const angle = (Math.PI * 2 * index) / pointCount;
      const wobble = 0.82 + next() * 0.24 + Math.sin(index * 1.71 + seed) * 0.035;
      const localX = Math.cos(angle) * radiusX * wobble;
      const localY = Math.sin(angle) * radiusY * (0.84 + next() * 0.22);
      const cos = Math.cos(rotation);
      const sin = Math.sin(rotation);
      points.push({
        x: centerX + localX * cos - localY * sin,
        y: centerY + localX * sin + localY * cos,
      });
    }
    const midpoint = (left, right) => ({
      x: (left.x + right.x) * 0.5,
      y: (left.y + right.y) * 0.5,
    });
    const path = new Path2D();
    const firstMidpoint = midpoint(points[0], points[1]);
    path.moveTo(firstMidpoint.x, firstMidpoint.y);
    for (let index = 0; index < pointCount; index += 1) {
      const point = points[index];
      const nextPoint = points[(index + 1) % pointCount];
      path.quadraticCurveTo(point.x, point.y, midpoint(point, nextPoint).x, midpoint(point, nextPoint).y);
    }
    path.closePath();
    return path;
  }

  function drawPigmentDrop(ctx, item, scale, alpha, rotation, blur) {
    const { radius, color } = item;
    const next = random(item.seed + Math.round(scale * 1000));
    const radiusX = radius * scale * (0.94 + next() * 0.12) * (item.stretchX || 1);
    const radiusY = radius * scale * (0.72 + next() * 0.18) * (item.stretchY || 1);
    const centerX = item.coreX ?? item.x;
    const centerY = item.coreY ?? item.y;
    const fadeRadius = Math.max(1, Math.max(radiusX, radiusY) * 1.08);
    const gradient = ctx.createRadialGradient(
      centerX,
      centerY,
      Math.max(1, fadeRadius * 0.025),
      centerX,
      centerY,
      fadeRadius,
    );
    const isDim = item.moodScore <= -0.2;
    const pigment = isDim ? 0.94 : 1;
    // Keep the wash unchanged while making the actual pigment core readable
    // above neighboring transparent washes.
    const coreAlpha = Math.min(0.94, alpha + 0.18);
    gradient.addColorStop(0, rgba(color.fill, coreAlpha * pigment));
    gradient.addColorStop(0.16, rgba(color.fill, coreAlpha * 0.98));
    gradient.addColorStop(0.32, rgba(color.fill, alpha * 0.94));
    gradient.addColorStop(0.38, rgba(color.fill, alpha * 0.88));
    gradient.addColorStop(0.58, rgba(color.fill, alpha * 0.62));
    gradient.addColorStop(0.76, rgba(color.fill, alpha * 0.32));
    gradient.addColorStop(0.9, rgba(color.fill, alpha * 0.11));
    gradient.addColorStop(0.98, rgba(color.fill, alpha * 0.025));
    gradient.addColorStop(1, rgba(color.fill, 0));

    ctx.save();
    ctx.globalAlpha = 1;
    ctx.filter = `blur(${blur}px) saturate(1.06)`;
    ctx.fillStyle = gradient;
    ctx.fill(makePigmentPath(centerX, centerY, radiusX, radiusY, rotation, item.seed + Math.round(scale * 1000)));
    ctx.restore();
  }

  function drawBlob(ctx, item) {
    const rotation = item.paintRotation ?? item.rotation;
    const coverage = item.coverageProgress || 0;
    // Raise the whole pigment field, not just its center. The gradient shape
    // and fade positions stay unchanged so the watercolor wash remains soft.
    const alpha = 0.82 + coverage * 0.06;

    // A life trace is one pigment field: a clear center dissolving into the
    // water. Keeping the core and the wash in one shape avoids visible rings.
    drawPigmentDrop(
      ctx,
      item,
      item.paintScale || 1.42,
      alpha,
      rotation,
      Math.max(3, item.radius * (0.045 + coverage * 0.018)),
    );
  }

  function createLifePalette(root) {
    const canvas = root.querySelector(".life-palette-canvas");
    const labelLayer = root.querySelector(".life-palette-labels");
    const detail = root.querySelector(".life-palette-detail");
    if (!canvas || !labelLayer || !detail) return { render() {} };

    let items = [];
    let selectedKey = "";

    function drawOrder(list) {
      const selected = selectedKey ? list.find((item) => item.key === selectedKey) : null;
      if (!selected) return list;
      return [...list.filter((item) => item.key !== selectedKey), selected];
    }

    function draw() {
      const currentRect = canvas.getBoundingClientRect();
      const widthHint = currentRect.width || root.getBoundingClientRect().width || 620;
      root.style.setProperty("--life-palette-height", `${paletteHeightFor(items.length, widthHint)}px`);
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const deviceScale = window.devicePixelRatio || 1;
      const width = rect.width;
      const height = rect.height;
      canvas.width = Math.round(width * deviceScale);
      canvas.height = Math.round(height * deviceScale);
      const ctx = canvas.getContext("2d");
      ctx.setTransform(deviceScale, 0, 0, deviceScale, 0, 0);
      ctx.clearRect(0, 0, width, height);
      const laidOut = layoutItems(items, width, height);
      items = laidOut;
      const island = drawField(ctx, width, height, laidOut);
      ctx.save();
      ctx.clip(island);
      drawOrder(laidOut).forEach((item) => drawBlob(ctx, item));
      ctx.restore();
      laidOut.forEach((item) => {
        const button = labelLayer.querySelector(`[data-life-key="${CSS.escape(item.key)}"]`);
        if (!button) return;
        const labelLength = [...String(localize(item.shortLabel))].length;
        const labelWidth = Math.max(item.radius * 0.84 * item.stretchX, labelLength > 3 ? 78 : labelLength > 2 ? 64 : 48);
        const labelHeight = Math.max(item.radius * 0.64 * item.stretchY, 36);
        button.style.left = `${((item.coreX ?? item.x) / width) * 100}%`;
        button.style.top = `${((item.coreY ?? item.y) / height) * 100}%`;
        button.style.width = `${(labelWidth / width) * 100}%`;
        button.style.height = `${(labelHeight / height) * 100}%`;
      });
    }

    function showDetail(item) {
      if (!item) {
        detail.classList.remove("has-selection");
        detail.innerHTML = `<span>${escapeHtml(global.EmotionIslandI18n?.t("palette.detail") || "点击一个色块，看看它留下了什么。")}</span>`;
        return;
      }
      detail.classList.add("has-selection");
      const sourceSummary = item.sourceSummary ? `<small>${escapeHtml(localize(item.sourceSummary))}</small>` : "";
      detail.innerHTML = `<strong>${escapeHtml(localize(item.fullLabel))} · ${escapeHtml(localizedCount(item.count))}</strong><p>${escapeHtml(localize(item.detail))}</p>${sourceSummary}`;
    }

    function select(key) {
      selectedKey = selectedKey === key ? "" : key;
      const selected = items.find((item) => item.key === selectedKey);
      labelLayer.querySelectorAll(".life-palette-label").forEach((button) => {
        button.classList.toggle("is-selected", button.dataset.lifeKey === selectedKey);
        button.setAttribute("aria-pressed", String(button.dataset.lifeKey === selectedKey));
      });
      showDetail(selected);
      draw();
    }

    function itemAtPoint(event) {
      const rect = canvas.getBoundingClientRect();
      if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      ) return null;
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      return drawOrder(items).reverse().find((item) => {
        const deltaX = x - (item.coreX ?? item.x);
        const deltaY = y - (item.coreY ?? item.y);
        const rotation = item.paintRotation ?? item.rotation;
        const cos = Math.cos(-rotation);
        const sin = Math.sin(-rotation);
        const rotatedX = deltaX * cos - deltaY * sin;
        const rotatedY = deltaX * sin + deltaY * cos;
        const hitScale = (item.paintScale || 1.48) * 1.06;
        const distanceX = rotatedX / (item.radius * hitScale * item.stretchX);
        const distanceY = rotatedY / (item.radius * hitScale * item.stretchY);
        return distanceX * distanceX + distanceY * distanceY <= 1;
      });
    }

    function render(nextItems = []) {
      items = nextItems;
      selectedKey = items.some((item) => item.key === selectedKey) ? selectedKey : "";
      root.classList.toggle("is-empty", !items.length);
      labelLayer.innerHTML = items
        .map(
          (item) => `
            <button
              class="life-palette-label"
              type="button"
              data-life-key="${escapeHtml(item.key)}"
              aria-pressed="false"
              aria-label="${escapeHtml(`${localize(item.fullLabel)}，${localizedCount(item.count)}`)}"
              style="--life-label-color:#111814;"
            >${escapeHtml(localize(item.shortLabel))}</button>`,
        )
        .join("");
      labelLayer.querySelectorAll(".life-palette-label").forEach((button) => {
        button.addEventListener("click", () => select(button.dataset.lifeKey));
      });
      showDetail(items.find((item) => item.key === selectedKey));
      draw();
    }

    window.addEventListener("resize", draw, { passive: true });
    window.addEventListener("emotion-island-language-change", () => {
      labelLayer.querySelectorAll(".life-palette-label").forEach((button) => {
        const item = items.find((candidate) => candidate.key === button.dataset.lifeKey);
        if (!item) return;
        button.textContent = localize(item.shortLabel);
        button.setAttribute("aria-label", `${localize(item.fullLabel)}，${localizedCount(item.count)}`);
      });
      showDetail(items.find((item) => item.key === selectedKey));
      draw();
    });
    root.addEventListener("click", (event) => {
      if (event.target.closest(".life-palette-label")) return;
      const item = itemAtPoint(event);
      if (item) select(item.key);
      window.requestAnimationFrame(draw);
    });

    return { render, refresh: draw };
  }

  global.EmotionIslandLifePalette = { createLifePalette };
})(globalThis);
