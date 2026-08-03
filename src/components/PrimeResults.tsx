import { useEffect, useState } from 'react';
import { getPointsForRank } from '../utils/scoring';
import styles from './PrimeResults.module.scss';

interface PrimeResultsProps {
  open: boolean;
  onClose: () => void;
}

interface TournamentResultEntry {
  name: string;
  place: number;
}

const DATA_URL = './data/tr2p.json';
const BRACKET_URL = 'https://challonge.com/TR2P';

const SCORING_ROWS: { place: string; points: number }[] = [
  { place: '1 место', points: 11 },
  { place: '2 место', points: 10 },
  { place: '3 место', points: 8 },
  { place: '4 место', points: 7 },
  { place: '5-6 место', points: 6 },
  { place: '7-8 место', points: 5 },
  { place: '9-12 место', points: 4 },
  { place: '13-16 место', points: 3 },
  { place: '17-32 место', points: 2 },
  { place: '33 место и ниже', points: 1 },
];

const PrimeResults: React.FC<PrimeResultsProps> = ({ open, onClose }) => {
  const [results, setResults] = useState<TournamentResultEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || results.length) return;

    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(DATA_URL);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const data = (await response.json()) as TournamentResultEntry[];
        if (!cancelled) {
          setResults(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Не удалось загрузить результаты'
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [open, results.length]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={e => e.stopPropagation()}>
        <button
          type='button'
          className={styles.close}
          aria-label='Закрыть результаты'
          onClick={onClose}
        >
          ×
        </button>

        <h2 className={styles.title}>
          TEKKEN RIVALS 2™ PRIME — итоги первого турнира
        </h2>

        <div className={styles.body}>
          <div className={styles.results}>
            {isLoading && (
              <div className={styles.status}>Загрузка результатов…</div>
            )}

            {error && (
              <div className={styles.status}>
                <p>Не удалось загрузить результаты.</p>
                <a href={BRACKET_URL} target='_blank' rel='noopener noreferrer'>
                  Открыть сетку на Challonge
                </a>
              </div>
            )}

            {!isLoading && !error && (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Место</th>
                    <th>Игрок</th>
                    <th>Очки</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((row, index) => (
                    <tr
                      key={`${row.place}-${row.name}-${index}`}
                      className={styles.clickable}
                      title={`Открыть профиль Challonge: ${row.name}`}
                      onClick={() =>
                        window.open(challongeProfileUrl(row.name), '_blank')
                      }
                    >
                      <td className={styles.place}>{formatPlace(row.place)}</td>
                      <td className={styles.name}>{row.name}</td>
                      <td className={styles.points}>
                        {getPointsForRank(row.place)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <aside className={styles.sidebar}>
            <h3>Система начисления очков</h3>
            <div className={styles.scoring}>
              {SCORING_ROWS.map(row => (
                <div key={row.place} className={styles.scoringRow}>
                  <span className={styles.scoringPlace}>{row.place}</span>
                  <span className={styles.scoringDots} />
                  <span className={styles.scoringPoints}>{row.points}</span>
                </div>
              ))}
            </div>
            <p className={styles.note}>
              Топ 8 по итогам четырёх турниров попадают в TEKKEN RIVALS 2™ PRIME
              FINALS и сражаются по системе Round Robin.
            </p>
            <a
              href={BRACKET_URL}
              target='_blank'
              rel='noopener noreferrer'
              className={styles.bracketLink}
            >
              Смотреть полную сетку →
            </a>
          </aside>
        </div>
      </div>
    </div>
  );
};

function formatPlace(place: number): string {
  if (place >= 33) return `${place}+`;
  return String(place);
}

function challongeProfileUrl(name: string): string {
  return `https://challonge.com/users/${encodeURIComponent(name)}`;
}

export default PrimeResults;
