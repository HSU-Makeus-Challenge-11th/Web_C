import { createFileRoute } from '@tanstack/react-router';
import { MembersPage } from '../pages/members/membersPage';

export const Route = createFileRoute('/members')({
  component: MembersPage,
});
