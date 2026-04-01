# STAGE 1 ART MANIFEST — THE MAZE OF THORNS

> **District of Past Habits**
> *Decaying stone, dark vines, broken clockwork, dying amber light.*

## 1. VISUAL TOKENS (CSS PALETTE)

These colors should be used for `CanvasModulate`, `Light2D`, and Shader uniforms to ensure Law 03 compliance.

```css
:root {
  --atmosphere-core: #0d1428; /* Deep Midnight Blue */
  --shadow-past-amber: #b8860b; /* Dark Goldenrod / Amber */
  --light-future-cyan: #00ffff; /* Cyan */
  --light-future-white: #f0f8ff; /* Alice Blue / Alabaster */
  --accent-thorn-red: #450a0a; /* Dried Blood / Dark Thorn */
}
```

## 2. ASSET GENERATION PROMPTS (MIDJOURNEY/LEONARDO)

### A. Environment Tilemaps
> **Prompt:** `Side-scrolling 2D game tilemap, decaying Gothic stone architecture, massive intertwined black thorns, creeping graveyard vines, weathered stone texture, Metaphysical Industrialism style, chiaroscuro lighting, deep indigo and amber highlights, high contrast, sharp edges, seamless --tile --v 6.0`

### B. Background Parallax Layers
> **Prompt:** `Ethereal gothic ruins in a void, silhouettes of broken clockwork towers, distant amber glow, thick atmospheric fog, layered depth, Metaphysical Industrialism, wide aspect ratio, 35mm lens, f/1.8, cinematic side-lighting --ar 16:9 --v 6.0`

### C. Decorative Props (Gears & Clockwork)
> **Prompt:** `Broken monumental clockwork gears, rusted brass and obsidian, Gothic filigree, overgrown with dark thorns, isolated on white background, game asset sprite, 4k, hyper-detailed --v 6.0`

### D. Lighting & Hazards
> **Prompt:** `Dying amber gas lamp, Art Nouveau ironwork, flickering warm light, surrounded by sharp thorn vines, isolated on white background, game asset sprite, dark fantasy --v 6.0`

## 3. HERO ASSET PROMPTS (Midjourney v6, Laws-Checked)

### E. Stage 1 Tilemap (Full Scene)
> **Bible Anchor:** "Decaying stone, dark vines, broken clockwork, dying amber light."
> **Laws:** LAW 02 (Landscape), LAW 03 (Directionality), LAW 06 (No White Light)
> **Prompt:** `A 2D side-scrolling video game tilemap set in a decaying industrial maze. Left side of the frame shows ancient, crumbling stone walls overgrown with sharp, obsidian-black thorns and dying amber lanterns casting long, distorted shadows. Right side shows faint, cold blueprint-blue light emerging from cracks in the ceiling. Metaphysical Industrialism style, heavy chiaroscuro, mechanical gears partially merged with stone. High contrast, textures for moss and rusted iron. --ar 16:9 --tile --style raw --v 6`

### F. Environment Props (Clockwork + Gambling Den)
> **Bible Anchor:** "Broken clockwork, gambling den aesthetics."
> **Laws:** LAW 03 (Directionality), LAW 04 (Mechanical Symbols)
> **Prompt:** `A collection of psychological environment props for a cyber-noir game. Fractured brass clockwork mechanisms, cracked ivory poker chips with glowing indigo runes, and rusted mechanical vines tangled around a broken stone pedestal. Dramatic side-lighting from the right (white/cyan) hitting the objects while the left side (amber/shadow) remains in deep decay. 35mm lens quality, f/1.8, shallow depth of field, set against a dark charcoal background. --ar 16:9 --style raw --v 6`

### G. The Warden of Routine (Boss Silhouette)
> **Bible Anchor:** "Boss: THE WARDEN OF ROUTINE."
> **Laws:** LAW 01 (No Face), LAW 03 (Directionality), LAW 05 (Turbulent River)
> **Prompt:** `Cinematic boss reveal of THE WARDEN OF ROUTINE. A massive, looming silhouette standing in a chamber of grinding gears. No visible face, hooded and cloaked in a trailing "River of Consciousness" (dark reflective fluid with distorted star reflections). The Warden stands on the left in deep amber shadows and charcoal soot, reach towards the right where a sliver of blinding cyan light cuts through the darkness. Metaphysical industrialism, heavy chiaroscuro, dramatic scale. --ar 16:9 --style raw --v 6`

## 4. DESIGN NOTES
- **Thorns**: Should appear "hungry" and invasive, choking the architectural elements.
- **Clockwork**: Represents the "Routine" mentioned in the Bible. It should look seized, rusted, or malfunctioning.
- **Directionality**: Always ensure assets generated for the left side are more "Amber/Shadowed" and the right side are more "Cyan/White/Clear".
