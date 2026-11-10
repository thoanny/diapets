export type Animal = {
  id: string;
  name: string;
  created_by: string;
  species: 'cat' | 'dog' | null;
  birth_date: string | null;
};

export type AnimalMemberRole = 'owner' | 'member';

export type AnimalMember = {
  animal_id: string;
  user_id: string;
  role: AnimalMemberRole;
};

export type AnimalInvite = {
  code: string;
  animal_id: string;
  expires_at: Date;
};
