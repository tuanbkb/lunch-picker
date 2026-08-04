import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import type { FoodOption } from '../types';

interface FoodCardProps {
  food: FoodOption;
  selected: boolean;
  disabled?: boolean;
  onSelect: (foodId: string) => void;
}

export default function FoodCard({ food, selected, disabled, onSelect }: FoodCardProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        borderColor: selected ? 'primary.main' : 'divider',
        borderWidth: selected ? 2 : 1,
        boxShadow: selected ? 4 : 0,
        bgcolor: (theme) => (selected ? alpha(theme.palette.primary.main, 0.06) : 'background.paper'),
        position: 'relative',
      }}
    >
      <CardActionArea
        onClick={() => onSelect(food.id)}
        disabled={disabled}
        sx={{ height: '100%', p: 1 }}
        aria-pressed={selected}
      >
        {selected && (
          <CheckCircleIcon
            color="primary"
            sx={{ position: 'absolute', top: 10, right: 10, fontSize: 26, zIndex: 1 }}
          />
        )}
        <CardContent sx={{ textAlign: 'center', py: 3 }}>
          <Typography component="div" sx={{ fontSize: 48, lineHeight: 1 }}>
            {food.emoji}
          </Typography>
          <Typography variant="h6" sx={{ mt: 1.5 }}>
            {food.name}
          </Typography>
          <Box sx={{ mt: 0.5, mb: 1 }}>
            <Chip label={food.category} size="small" variant="outlined" />
          </Box>
          <Typography variant="body2" color="text.secondary">
            {food.description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
