import { Skill } from "./skill.model";

export interface User {
  id: string;
  name: string;
  email: string;
  uid: string;
  role: string;
  image: string;
  description: string;
  phone: string;
  skills: Skill[];
}