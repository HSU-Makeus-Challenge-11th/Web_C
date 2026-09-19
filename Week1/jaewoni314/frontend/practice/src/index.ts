type MemberRole = "leader" | "member";

interface StudyMember {
  id: number;
  name: string;
  role: MemberRole;
  githubId?: string;
}

const members: StudyMember[] = [
  {
    id: 1,
    name: "서희",
    role: "leader",
    githubId: "kimyesol",
  },
  {
    id: 2,
    name: "광수",
    role: "member",
  },
];

function createMemberGuide(memberId: number): string {
  const foundMember = members.find((member) => member.id === memberId);

  if (!foundMember) {
    return `ID ${memberId} 회원을 찾을 수 없습니다.`;
  }

  const roleName = foundMember.role === "leader" ? "리더" : "멤버";
  const githubId = foundMember.githubId ?? "GitHub 아이디 없음";

  return `${foundMember.name} 님은 ${roleName}입니다. GitHub: ${githubId}`;
}

console.log(createMemberGuide(1));
console.log(createMemberGuide(2));
console.log(createMemberGuide(999));