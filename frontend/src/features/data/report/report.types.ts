export type DailyViewStat = {
  date: string;
  totalViews: string;
};

export interface StoryStats {
  total: number;
  ongoing: number;
  completed: number;
  hiatus: number;
}
