import { useState } from 'react';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { deleteOldVotes } from '../api/voteApi';
import { useFoods } from '../hooks/useFoods';
import { useVoteResults } from '../hooks/useVoteResults';

export default function ResultsView() {
  const { results, totalVotes, loading: resultsLoading, error: resultsError } = useVoteResults();
  const { foods, loading: foodsLoading, error: foodsError } = useFoods();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notice, setNotice] = useState<{ severity: 'success' | 'error'; message: string } | null>(
    null,
  );

  async function handleConfirmDelete() {
    setIsDeleting(true);
    try {
      const count = await deleteOldVotes();
      setNotice({
        severity: 'success',
        message:
          count === 0
            ? 'Không có bình chọn cũ nào để xóa.'
            : `Đã xóa ${count} bình chọn từ những ngày trước.`,
      });
    } catch (deleteError) {
      console.error('[ResultsView] deleteOldVotes failed', deleteError);
      setNotice({ severity: 'error', message: 'Không thể xóa bình chọn cũ. Vui lòng thử lại.' });
    } finally {
      setIsDeleting(false);
      setConfirmOpen(false);
    }
  }

  if (resultsLoading || foodsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (resultsError || foodsError) {
    return <Alert severity="error">{resultsError ?? foodsError}</Alert>;
  }

  const resultsByFoodId = new Map(results.map((result) => [result.foodId, result.votes]));
  const maxVotes = Math.max(1, ...results.map((result) => result.votes));

  const ranked = foods
    .map((food) => ({
      food,
      votes: resultsByFoodId.get(food.id) ?? 0,
    }))
    .sort((a, b) => b.votes - a.votes);

  return (
    <Stack spacing={2}>
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
        {totalVotes === 0
          ? 'Chưa có lượt bình chọn nào hôm nay — hãy là người đầu tiên!'
          : `Đã có ${totalVotes} lượt bình chọn hôm nay`}
      </Typography>

      {ranked.map(({ food, votes }, index) => (
        <Paper key={food.id} variant="outlined" sx={{ p: 2 }}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <Typography component="div" sx={{ fontSize: 28, lineHeight: 1, width: 36 }}>
              {food.emoji}
            </Typography>
            <Box sx={{ flexGrow: 1 }}>
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
                <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                  <Typography variant="subtitle1">{food.name}</Typography>
                  {index === 0 && votes > 0 && (
                    <EmojiEventsIcon fontSize="small" sx={{ color: 'warning.main' }} />
                  )}
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {votes} phiếu
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={(votes / maxVotes) * 100}
                sx={{ mt: 0.75, height: 8, borderRadius: 4 }}
              />
            </Box>
          </Stack>
        </Paper>
      ))}

      <Stack sx={{ alignItems: 'center', pt: 2 }}>
        <Button
          size="small"
          color="inherit"
          startIcon={<DeleteSweepIcon fontSize="small" />}
          onClick={() => setConfirmOpen(true)}
          sx={{ color: 'text.secondary' }}
        >
          Xóa bình chọn cũ
        </Button>
      </Stack>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Xóa bình chọn cũ?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Việc này sẽ xóa vĩnh viễn tất cả bình chọn của những ngày trước (không ảnh hưởng đến
            kết quả hôm nay). Không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} disabled={isDeleting}>
            Hủy
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleConfirmDelete}
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={16} color="inherit" /> : undefined}
          >
            {isDeleting ? 'Đang xóa…' : 'Xóa'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notice !== null}
        autoHideDuration={5000}
        onClose={() => setNotice(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {notice ? (
          <Alert severity={notice.severity} variant="filled" onClose={() => setNotice(null)}>
            {notice.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Stack>
  );
}
