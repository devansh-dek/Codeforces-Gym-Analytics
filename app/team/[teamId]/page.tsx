import TeamDetailPage from '@/components/TeamDetailPage';

export default function TeamPage({ params }: { params: { teamId: string } }) {
  return <TeamDetailPage teamId={params.teamId} />;
}
