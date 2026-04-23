import { describe, it, expect } from 'vitest';
import { buildBadgeHtml } from '../badge-print';

const baseData = {
  fullName: 'João Silva',
  qrDataUrl: 'data:image/png;base64,FAKEQR',
  logoText: 'COMUNIDADE',
  link: 'https://linkedin.com/in/joaosilva',
};

describe('buildBadgeHtml', () => {
  it('matches snapshot for a normal badge', () => {
    expect(buildBadgeHtml(baseData)).toMatchSnapshot();
  });

  it('renders without a link when link is omitted', () => {
    const html = buildBadgeHtml({ ...baseData, link: undefined });
    expect(html).not.toContain('class="link-text"');
  });

  it('emits @page size 50mm 100mm portrait (kiosk-mode workaround)', () => {
    const html = buildBadgeHtml(baseData);
    expect(html).toContain('@page { size: 50mm 100mm; margin: 0; }');
  });

  it('sets body to portrait dimensions matching @page', () => {
    const html = buildBadgeHtml(baseData);
    expect(html).toContain('width: 50mm !important');
    expect(html).toContain('height: 100mm !important');
  });

  it('rotates badge container -90deg to compensate for printer rotation', () => {
    const html = buildBadgeHtml(baseData);
    expect(html).toContain('transform: translate(0, 100mm) rotate(-90deg)');
    expect(html).toContain('transform-origin: top left');
  });

  it('keeps badge container at intrinsic 100mm x 50mm landscape dimensions', () => {
    const html = buildBadgeHtml(baseData);
    expect(html).toMatch(/\.badge-container\s*\{[^}]*width:\s*100mm[^}]*height:\s*50mm/);
  });

  it('emits page-break-inside: avoid on the badge container', () => {
    const html = buildBadgeHtml(baseData);
    expect(html).toContain('page-break-inside: avoid');
    expect(html).toContain('break-inside: avoid');
  });

  it('clamps long names to 2 lines via -webkit-line-clamp', () => {
    const html = buildBadgeHtml(baseData);
    expect(html).toContain('-webkit-line-clamp: 2');
  });

  it('escapes HTML special characters in user input', () => {
    const html = buildBadgeHtml({
      ...baseData,
      fullName: '<script>alert("xss")</script>',
      logoText: 'A & B',
      link: 'https://example.com/?a=1&b=2',
    });
    expect(html).not.toContain('<script>alert');
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('A &amp; B');
    expect(html).toContain('a=1&amp;b=2');
  });

  it('does not inject an inline window.print() script (parent owns lifecycle)', () => {
    const html = buildBadgeHtml(baseData);
    expect(html).not.toContain('window.print()');
    expect(html).not.toContain('window.onload');
  });
});
