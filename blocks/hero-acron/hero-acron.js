import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Hero block modeled after the acronaviation.com "HeroStandard" component.
 * Authored content: up to five rows, each containing exactly one column with
 * one type of content, in this order:
 *   1. Background image (picture)
 *   2. Supertitle (short line above the heading)
 *   3. Heading (h1/h2/h3)
 *   4. Copy paragraph
 *   5. Buttons - a paragraph with one or two links (first = primary, second = secondary)
 *
 * Rows are optional except the heading; detection is based on the content
 * found in each row rather than a fixed row index, so authors can omit a
 * row (e.g. no supertitle) without breaking the block.
 */
export default function decorate(block) {
  const rows = [...block.children];

  let pictureEl = null;
  let superTitleEl = null;
  let headingEl = null;
  let copyEl = null;
  let ctaEl = null;

  rows.forEach((row) => {
    const picture = row.querySelector('picture');
    const heading = row.querySelector('h1, h2, h3, h4');
    const linksInRow = [...row.querySelectorAll('a')];
    const textEl = row.querySelector('p, div');

    if (picture && !pictureEl) {
      pictureEl = picture;
      return;
    }

    if (linksInRow.length && !ctaEl) {
      ctaEl = linksInRow;
      return;
    }

    if (heading && !headingEl) {
      headingEl = heading;
      return;
    }

    if (textEl && textEl.textContent.trim()) {
      if (!superTitleEl) {
        superTitleEl = textEl;
      } else if (!copyEl) {
        copyEl = textEl;
      }
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

  if (headingEl) {
    headingEl.classList.add('hero-acron-heading');
    content.append(headingEl);
  }

  if (copyEl) {
    const copy = document.createElement('p');
    copy.className = 'hero-acron-copy';
    copy.innerHTML = copyEl.innerHTML;
    content.append(copy);
  }

  if (ctaEl && ctaEl.length) {
    const cta = document.createElement('div');
    cta.className = 'hero-acron-cta';
    ctaEl.forEach((link, i) => {
      link.classList.add('button');
      link.classList.add(i === 0 ? 'primary' : 'secondary');
      cta.append(link);
    });
    content.append(cta);
  }

  const imageWrapper = document.createElement('div');
  imageWrapper.className = 'hero-acron-image';
  if (pictureEl) {
    const img = pictureEl.querySelector('img');
    if (img) {
      const src = img.getAttribute('src');
      const alt = img.getAttribute('alt') || '';
      imageWrapper.append(
        createOptimizedPicture(src, alt, true, [{ width: '2000' }, { width: '1200' }, { width: '750' }]),
      );
    }
  }

  const overlay = document.createElement('div');
  overlay.className = 'hero-acron-overlay';

  block.replaceChildren(imageWrapper, overlay, content);
}
