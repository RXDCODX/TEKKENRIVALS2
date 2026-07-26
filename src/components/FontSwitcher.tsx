import { useCallback, useEffect, useState } from 'react';
import { FONT_CATALOG } from '../data/fontCatalog';
import { loadGoogleFont } from '../utils/fontLoader';
import styles from './FontSwitcher.module.scss';

type FontRole = 'title' | 'heading' | 'body';

const ROLES: { role: FontRole; label: string; cssVar: string }[] = [
  { role: 'title', label: 'Title', cssVar: '--font-title' },
  { role: 'heading', label: 'Heading', cssVar: '--font-heading' },
  { role: 'body', label: 'Body', cssVar: '--font-body' },
];

const STORAGE_KEY = 'tekkenrivals2.devFonts';

type Selections = Partial<Record<FontRole, string>>;

function readStoredSelections(): Selections {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Selections) : {};
  } catch {
    return {};
  }
}

function applySelection(cssVar: string, family: string | undefined) {
  if (family) {
    loadGoogleFont(family);
    document.documentElement.style.setProperty(
      cssVar,
      `'${family}', sans-serif`
    );
  } else {
    document.documentElement.style.removeProperty(cssVar);
  }
}

const FontSwitcher: React.FC = () => {
  const [selections, setSelections] = useState<Selections>(() =>
    readStoredSelections()
  );
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    for (const { role, cssVar } of ROLES) {
      const id = selections[role];
      const entry = FONT_CATALOG.find(f => f.id === id);
      applySelection(cssVar, entry?.family);
    }
    // Only re-apply on mount — subsequent changes are applied directly in handleChange.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = useCallback(
    (role: FontRole, cssVar: string, id: string) => {
      setSelections(prev => {
        const next = { ...prev };
        if (id) {
          next[role] = id;
        } else {
          delete next[role];
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });

      const entry = FONT_CATALOG.find(f => f.id === id);
      applySelection(cssVar, entry?.family);
    },
    []
  );

  const handleReset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSelections({});
    for (const { cssVar } of ROLES) {
      document.documentElement.style.removeProperty(cssVar);
    }
  }, []);

  return (
    <div className={styles.panel}>
      <button
        className={styles.toggle}
        onClick={() => setCollapsed(c => !c)}
        title={collapsed ? 'Показать переключатель шрифтов' : 'Свернуть'}
      >
        Fonts {collapsed ? '▸' : '▾'}
      </button>

      {!collapsed && (
        <div className={styles.body}>
          {ROLES.map(({ role, label, cssVar }) => (
            <label key={role} className={styles.row}>
              <span className={styles.rowLabel}>{label}</span>
              <select
                className={styles.select}
                value={selections[role] ?? ''}
                onChange={e => handleChange(role, cssVar, e.target.value)}
              >
                <option value=''>по умолчанию</option>
                {FONT_CATALOG.map(font => (
                  <option key={font.id} value={font.id}>
                    {font.cyrillic ? '✓' : '⚠'} {font.family}
                  </option>
                ))}
              </select>
            </label>
          ))}
          <button className={styles.reset} onClick={handleReset}>
            Сбросить
          </button>
        </div>
      )}
    </div>
  );
};

export default FontSwitcher;
