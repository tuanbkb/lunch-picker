import { useEffect, useRef, useState } from 'react';
import CasinoIcon from '@mui/icons-material/Casino';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import { useFoods } from '../hooks/useFoods';
import { useVoteResults } from '../hooks/useVoteResults';
import type { FoodOption } from '../types';
import {
  buildSpinSequence,
  decideFood,
  spinStepDelay,
  type DecideMode,
} from '../utils/decideFood';

const MODE_OPTIONS: { value: DecideMode; label: string; description: string }[] = [
  {
    value: 'topVoted',
    label: 'Ngẫu nhiên trong món dẫn đầu',
    description: 'Chỉ chọn ngẫu nhiên giữa các món đang có số phiếu cao nhất.',
  },
  {
    value: 'weighted',
    label: 'Ngẫu nhiên theo trọng số phiếu',
    description: 'Chỉ xét món đã có phiếu; món nhiều phiếu hơn có xác suất trúng cao hơn.',
  },
  {
    value: 'allFoods',
    label: 'Ngẫu nhiên tất cả món',
    description: 'Bốc thăm đều giữa mọi món trong danh sách, không xét phiếu bầu.',
  },
];

type SpinPhase = 'idle' | 'spinning' | 'done';

interface PickerTileProps {
  food: FoodOption;
  highlighted: boolean;
  won: boolean;
  dimmed: boolean;
}

function PickerTile({ food, highlighted, won, dimmed }: PickerTileProps) {
  return (
    <Paper
      variant="outlined"
      id={`decide-food-${food.id}`}
      sx={{
        p: 1.5,
        height: '100%',
        textAlign: 'center',
        position: 'relative',
        transition: 'transform 120ms ease, border-color 120ms ease, box-shadow 120ms ease, opacity 200ms ease, background-color 120ms ease',
        transform: highlighted || won ? 'scale(1.04)' : 'scale(1)',
        opacity: dimmed ? 0.35 : 1,
        borderWidth: highlighted || won ? 2 : 1,
        borderColor: won ? 'success.main' : highlighted ? 'primary.main' : 'divider',
        boxShadow: won || highlighted ? 4 : 0,
        bgcolor: (theme) => {
          if (won) return alpha(theme.palette.success.main, 0.1);
          if (highlighted) return alpha(theme.palette.primary.main, 0.12);
          return 'background.paper';
        },
      }}
    >
      {won && (
        <CheckCircleIcon
          color="success"
          sx={{ position: 'absolute', top: 8, right: 8, fontSize: 22 }}
        />
      )}
      <Typography component="div" sx={{ fontSize: 36, lineHeight: 1 }}>
        {food.emoji}
      </Typography>
      <Typography variant="subtitle2" sx={{ mt: 1 }}>
        {food.name}
      </Typography>
    </Paper>
  );
}

export default function DeciderView() {
  const { foods, loading: foodsLoading, error: foodsError } = useFoods();
  const { results, totalVotes, loading: resultsLoading, error: resultsError } = useVoteResults();
  const [mode, setMode] = useState<DecideMode>('topVoted');
  const [phase, setPhase] = useState<SpinPhase>('idle');
  const [candidates, setCandidates] = useState<FoodOption[]>([]);
  const [activeFoodId, setActiveFoodId] = useState<string | null>(null);
  const [winner, setWinner] = useState<FoodOption | null>(null);
  const [decideError, setDecideError] = useState<string | null>(null);
  const timersRef = useRef<number[]>([]);

  const isLoading = foodsLoading || resultsLoading;
  const isSpinning = phase === 'spinning';

  useEffect(() => {
    return () => {
      timersRef.current.forEach((timerId) => window.clearTimeout(timerId));
      timersRef.current = [];
    };
  }, []);

  function clearTimers() {
    timersRef.current.forEach((timerId) => window.clearTimeout(timerId));
    timersRef.current = [];
  }

  function handleDecide() {
    const outcome = decideFood(mode, foods, results);
    if (!outcome.ok) {
      clearTimers();
      setPhase('idle');
      setCandidates([]);
      setActiveFoodId(null);
      setWinner(null);
      setDecideError(outcome.reason);
      return;
    }

    clearTimers();
    setDecideError(null);
    setWinner(null);
    setCandidates(outcome.candidates);
    setActiveFoodId(null);
    setPhase('spinning');

    const sequence = buildSpinSequence(outcome.candidates, outcome.food);
    let delay = 0;

    sequence.forEach((food, index) => {
      delay += spinStepDelay(index, sequence.length);
      const timerId = window.setTimeout(() => {
        setActiveFoodId(food.id);
        document
          .getElementById(`decide-food-${food.id}`)
          ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        if (index === sequence.length - 1) {
          setWinner(outcome.food);
          setPhase('done');
        }
      }, delay);
      timersRef.current.push(timerId);
    });
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (foodsError || resultsError) {
    return <Alert severity="error">{foodsError ?? resultsError}</Alert>;
  }

  const showGrid = candidates.length > 0;

  return (
    <Stack spacing={3}>
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
        {totalVotes === 0
          ? 'Chưa có lượt bình chọn nào hôm nay — chế độ theo phiếu sẽ cần phiếu trước.'
          : `Đã có ${totalVotes} lượt bình chọn hôm nay`}
      </Typography>

      <Paper variant="outlined" sx={{ p: { xs: 2.5, sm: 3 } }}>
        <FormControl disabled={isSpinning}>
          <FormLabel id="decide-mode-label" sx={{ mb: 1.5, fontWeight: 600 }}>
            Cách chọn món
          </FormLabel>
          <RadioGroup
            aria-labelledby="decide-mode-label"
            name="decide-mode"
            value={mode}
            onChange={(event) => {
              setMode(event.target.value as DecideMode);
              setDecideError(null);
            }}
          >
            {MODE_OPTIONS.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio />}
                sx={{
                  alignItems: 'flex-start',
                  mb: 1.5,
                  mx: 0,
                  '&:last-of-type': { mb: 0 },
                }}
                label={
                  <Box sx={{ pt: 0.75 }}>
                    <Typography variant="subtitle1">{option.label}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {option.description}
                    </Typography>
                  </Box>
                }
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Paper>

      <Stack sx={{ alignItems: 'center' }}>
        <Button
          variant="contained"
          size="large"
          startIcon={isSpinning ? <CircularProgress size={18} color="inherit" /> : <CasinoIcon />}
          onClick={handleDecide}
          disabled={foods.length === 0 || isSpinning}
        >
          {isSpinning ? 'Đang bốc thăm…' : phase === 'done' ? 'Bốc thăm lại' : 'Bốc thăm ngay'}
        </Button>
      </Stack>

      {decideError && <Alert severity="warning">{decideError}</Alert>}

      {showGrid && (
        <Stack spacing={1.5}>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            {isSpinning
              ? 'Đang di chuyển giữa các món…'
              : phase === 'done' && winner
                ? `Đã chọn: ${winner.emoji} ${winner.name}`
                : 'Sẵn sàng bốc thăm'}
          </Typography>
          <Grid container spacing={1.5}>
            {candidates.map((food) => {
              const isWinner = phase === 'done' && winner?.id === food.id;
              const highlighted = activeFoodId === food.id && !isWinner;
              const dimmed = phase === 'done' && !isWinner;

              return (
                <Grid key={food.id} size={{ xs: 6, sm: 4, md: 3 }}>
                  <PickerTile
                    food={food}
                    highlighted={highlighted}
                    won={Boolean(isWinner)}
                    dimmed={dimmed}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Stack>
      )}

      {phase === 'done' && winner && (
        <Paper
          variant="outlined"
          sx={{
            p: 4,
            textAlign: 'center',
            borderColor: 'success.main',
            borderWidth: 2,
          }}
        >
          <Typography variant="overline" color="text.secondary">
            Món được chọn
          </Typography>
          <Typography component="div" sx={{ fontSize: 64, lineHeight: 1, mt: 1 }}>
            {winner.emoji}
          </Typography>
          <Typography variant="h4" sx={{ mt: 2 }}>
            {winner.name}
          </Typography>
          <Box sx={{ mt: 1, mb: 1.5 }}>
            <Chip label={winner.category} size="small" variant="outlined" />
          </Box>
          <Typography variant="body2" color="text.secondary">
            {winner.description}
          </Typography>
        </Paper>
      )}
    </Stack>
  );
}
