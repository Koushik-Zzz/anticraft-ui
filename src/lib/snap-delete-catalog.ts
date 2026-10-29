import type { ComponentDefinition } from './catalog';

export const snapDeleteComponents: ComponentDefinition[] = [{
  slug: 'snap-delete', title: 'Snap Delete', category: 'Experiments', tag: 'New',
  description: 'Delete text, images, or cards in a cloud of dust. Undo restores the content.',
  file: 'SnapDelete.tsx', cssFile: 'snap-delete.css',
  usage: `import { SnapDelete } from '@/components/anticraft/SnapDelete';

export function Example() {
  return (
    <SnapDelete label="field note" onDelete={() => console.log('Deleted')}>
      <div style={{ padding: 24, background: '#eae6d2', borderRadius: 2 }}>
        <h3>Field note</h3>
        <p>Take the scenic route.</p>
      </div>
    </SnapDelete>
  );
}`,
  props: [
    { name: 'children', type: 'ReactNode', default: 'Required', description: 'The removable content. Text, images, and ordinary HTML/CSS cards retain their appearance in the dust. Content remains mounted, hidden and inert after deletion, so Undo preserves local state.' },
    { name: 'label', type: 'string', default: "'Item'", description: 'Names the item in the native Delete/Undo controls and screen reader announcement.' },
    { name: 'duration', type: 'number', default: '1600', description: 'Dust animation length in milliseconds, clamped to 600–4000. Nonfinite values use the default.' },
    { name: 'particleSize', type: 'number', default: '3', description: 'Dust cell size in CSS pixels, clamped to 2–8. Large targets use larger cells to stay within the 12,000-cell limit.' },
    { name: 'buttonLabel', type: 'string', default: "'Delete'", description: 'The action label before deletion. The busy label is Deleting…' },
    { name: 'restoreLabel', type: 'string', default: "'Undo'", description: 'The action label after deletion.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables both actions. An already-running deletion still completes.' },
    { name: 'onDelete', type: '() => void', default: 'undefined', description: 'Called once after the visual deletion finishes. Connect persistence here. Removing the component in this callback also removes its Undo control.' },
    { name: 'onRestore', type: '() => void', default: 'undefined', description: 'Called once when Undo restores the retained content. Connect your data restoration here if needed.' },
    { name: 'className', type: 'string', default: "''", description: 'Additional root classes. Set --ac-snap-delete-accent to customize the Delete control. Allow space around the target for the dust.' },
  ],
  motion: 'A native Delete button splits a frozen copy of the content into small masked fragments, which drift upward and fade from right to left. Native Undo restores it without resetting child state. Decorative copies are hidden from assistive technology, inert, and removed on completion or unmount. Reduced motion skips the animation; hiding the document or scrolling the component offscreen completes the action. Embedded media, more than 160 elements, or unavailable CSS masks use a short fade. The effect runs only after activation and adds no idle animation loop or image-pixel/CORS requirement. It changes visibility locally; data persistence belongs in the callbacks.',
  useCases: ['Editable canvases', 'Image collections', 'Draft content'],
}];
