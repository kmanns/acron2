import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Hero block modeled after the acronaviation.com "HeroStandard" component.
 * Authored content (in order, each on its own row inside the block):
 *   1. Background image (picture)
 *   2. Supertitle (short line above the heading) - optional, wrapped in <p><em>...</em></p> or plain <p>
 *   3. Heading (h1/h2/h3)
 *   4. Copy paragraph - optional
 *   5. Buttons paragraph - optional, first link = primary, second link = secondary
 */
export default function decorate(block) {
  const rows = [...block.children];
  const picture = block.querySelector('picture');
  const heading = block.querySelector('h1, h2, h3');
  const links = [...block.querySelectorAll('a')];

  // Identify supertitle: the first <p> row (not containing the heading, image, or links)
  // that appears before the heading.
  let superTitleEl = null;
  let copyEl = null;

  rows.forEach((row) => {
    const p = row.querySelector(':scope > div > p, :scope > p');
    if (!p) return;
    if (p.querySelector('picture') || p.querySelector('a')) return;
    if (heading && row.contains(heading)) return;
    if (!superTitleEl && (!heading || row.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING)) {
      superTitleEl = p;
    } else if (superTitleEl && !copyEl) {
      copyEl = p;
    }
  });

  const content = document.createElement('div');
  content.className = 'hero-acron-content';

  if (superTitleEl) {
    const superTitle = document.createElement('p');
    superTitle.className = 'hero-acron-supertitle';
    superTitle.innerHTML = superTitleEl.innerHTML;
    content.append(superTitle);
  }

  if (heading) {
    heading.classList.add('hero-acron-heading');
    content.append(heading);
  }

  if (copyEl) {
    const copy = document.createElement('p');
    copy.className = 'hero-acron-copy';
    copy.innerHTML = copyEl.innerHTML;
    content.append(copy);
  }

  if (links.length) {
    const cta = document.createElement('div');
    cta.className = 'hero-acron-cta';
    links.forEach((link, i) => {
      link.classList.add('button');
      link.classList.add(i === 0 ? 'primary' : 'secondary');
      cta.append(link);
    });
    content.append(cta);
  }

  const imageWrapper = document.createElement('div');
  imageWrapper.className = 'hero-acron-image';
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      const src = img.getAttribute('src') || img.src;
      const alt = img.getAttribute('alt') || '';
      imageWrapper.append(createOptimizedPicture(src, alt, true, [{ width: '2000' }, { width: '1200' }, { width: '750' }]));
    }
  }

  const overlay = document.createElement('div');
  overlay.className = 'hero-acron-overlay';

  block.replaceChildren(imageWrapper, overlay, content);
}
