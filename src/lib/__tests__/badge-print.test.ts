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

  it('emits @page size 100mm 50mm with zero margin', () => {
    const html = buildBadgeHtml(baseData);
    expect(html).toContain('@page { size: 100mm 50mm; margin: 0; }');
  });

  it('sets body height to match @page (50mm), not the legacy 45mm', () => {
    const html = buildBadgeHtml(baseData);
    expect(html).toContain('height: 50mm !important');
    expect(html).not.toContain('height: 45mm');
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
