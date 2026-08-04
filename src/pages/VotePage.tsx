import { useMemo, useState, type SyntheticEvent } from 'react';
import CasinoIcon from '@mui/icons-material/Casino';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import Alert from '@mui/material/Alert';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { submitVote } from '../api/voteApi';
import FoodCard from '../components/FoodCard';
import ResultsView from '../components/ResultsView';
import { useFoods } from '../hooks/useFoods';
import { usePeople } from '../hooks/usePeople';
import { getTodayLabel } from '../utils/date';

const TODAY_LABEL = getTodayLabel();

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

export default function VotePage() {
  const { foods, loading: foodsLoading, error: foodsError } = useFoods();
  const { people, loading: peopleLoading, error: peopleError } = usePeople();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedFoodId, setSelectedFoodId] = useState<string | null>(null);
  const [voterName, setVoterName] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const categories = useMemo(
    () => ['Tất cả', ...Array.from(new Set(foods.map((food) => food.category)))],
    [foods],
  );

  const visibleFoods = useMemo(
    () =>
      activeCategory === 'Tất cả'
        ? foods
        : foods.filter((food) => food.category === activeCategory),
    [foods, activeCategory],
  );

  const selectedFood = foods.find((food) => food.id === selectedFoodId) ?? null;
  const isSubmitting = status === 'submitting';
  const hasVoted = status === 'success';
  const isLoadingCatalog = foodsLoading || peopleLoading;

  async function handleSubmit() {
    if (!selectedFoodId || !voterName) return;

    setStatus('submitting');
    setErrorMessage(null);

    try {
      await submitVote({
        foodId: selectedFoodId,
        voterName,
      });
      setStatus('success');
    } catch (error) {
      console.error('[submitVote] failed', error);
      setStatus('error');
      setErrorMessage('Không thể gửi bình chọn. Vui lòng thử lại.');
    }
  }

  function handleChangeVote() {
    setStatus('idle');
  }

  function handleRandomPick() {
    const candidates = visibleFoods.filter((food) => food.id !== selectedFoodId);
    const pool = candidates.length > 0 ? candidates : visibleFoods;
    if (pool.length === 0) return;

    const randomFood = pool[Math.floor(Math.random() * pool.length)];
    setSelectedFoodId(randomFood.id);
    document
      .getElementById(`food-${randomFood.id}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function handleTabChange(_event: SyntheticEvent, nextTab: number) {
    setActiveTab(nextTab);
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, sm: 5 } }}>
      <Stack spacing={0.5} sx={{ alignItems: 'center', textAlign: 'center', mb: 3 }}>
        <RestaurantIcon color="primary" sx={{ fontSize: 40 }} />
        <Typography variant="h4" component="h1">
          Hôm nay ăn gì?
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Bình chọn cho {TODAY_LABEL} — món được chọn nhiều nhất sẽ thắng!
        </Typography>
      </Stack>

      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        centered
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="Bình chọn" />
        <Tab label="Kết quả trực tiếp" />
      </Tabs>

      {activeTab === 1 ? (
        <ResultsView />
      ) : isLoadingCatalog ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : foodsError || peopleError ? (
        <Alert severity="error">{foodsError ?? peopleError}</Alert>
      ) : hasVoted && selectedFood ? (
        <Paper
          variant="outlined"
          sx={{ p: 4, textAlign: 'center', borderColor: 'success.main', borderWidth: 2 }}
        >
          <Typography component="div" sx={{ fontSize: 56, lineHeight: 1 }}>
            {selectedFood.emoji}
          </Typography>
          <Typography variant="h5" sx={{ mt: 2 }}>
            Bạn đã bình chọn cho {selectedFood.name}!
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Cảm ơn {voterName}! Xem tab Kết quả trực tiếp để theo dõi kết quả bình chọn.
          </Typography>
          <Stack direction="row" spacing={2} sx={{ justifyContent: 'center', mt: 3 }}>
            <Button variant="outlined" onClick={handleChangeVote}>
              Đổi lựa chọn
            </Button>
            <Button variant="contained" onClick={() => setActiveTab(1)}>
              Xem kết quả trực tiếp
            </Button>
          </Stack>
        </Paper>
      ) : (
        <>
          <Autocomplete
            options={people}
            value={voterName}
            onChange={(_event, newValue) => setVoterName(newValue)}
            disabled={isSubmitting}
            disablePortal
            sx={{ mb: 3, maxWidth: 320, mx: 'auto' }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Tên của bạn"
                placeholder="Tìm tên của bạn…"
                required
                size="small"
              />
            )}
          />

          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            sx={{ flexWrap: 'wrap', justifyContent: 'center', mb: 3 }}
          >
            {categories.map((category) => (
              <Chip
                key={category}
                label={category}
                color={activeCategory === category ? 'primary' : 'default'}
                variant={activeCategory === category ? 'filled' : 'outlined'}
                onClick={() => setActiveCategory(category)}
                sx={{ mb: 1 }}
              />
            ))}
          </Stack>

          <Stack sx={{ alignItems: 'center', mb: 3 }}>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<CasinoIcon />}
              disabled={isSubmitting || visibleFoods.length === 0}
              onClick={handleRandomPick}
            >
              Chọn ngẫu nhiên cho tôi
            </Button>
          </Stack>

          <Grid container spacing={2}>
            {visibleFoods.map((food) => (
              <Grid key={food.id} id={`food-${food.id}`} size={{ xs: 12, sm: 6, md: 4 }}>
                <FoodCard
                  food={food}
                  selected={food.id === selectedFoodId}
                  disabled={isSubmitting}
                  onSelect={setSelectedFoodId}
                />
              </Grid>
            ))}
          </Grid>

          <Paper
            elevation={3}
            sx={{
              position: 'sticky',
              bottom: 16,
              mt: 4,
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {selectedFood && voterName ? (
                <>
                  <strong>{voterName}</strong> chọn{' '}
                  <strong>{selectedFood.emoji} {selectedFood.name}</strong>
                </>
              ) : !voterName ? (
                'Chọn tên của bạn để bình chọn'
              ) : (
                'Chọn món để bình chọn'
              )}
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={
                isSubmitting ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <HowToVoteIcon />
                )
              }
              disabled={!selectedFoodId || !voterName || isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? 'Đang gửi…' : 'Gửi bình chọn'}
            </Button>
          </Paper>
        </>
      )}

      <Snackbar
        open={status === 'error'}
        autoHideDuration={5000}
        onClose={() => setStatus('idle')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" variant="filled" onClose={() => setStatus('idle')}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
