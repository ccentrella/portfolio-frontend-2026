export interface InviteForm {
	name: string,
	email: string,
	phone?: string
	message: string
	signup: boolean,
	token?: string,
}

export type SectionMap = Record<string, Section>;

export interface Section {
	id: string
	content: string,
	attributes: Attribute[]
}

export interface Attribute {
	id: string
	name: string,
}

export type ProjectMap = Record<string, Project>;

export interface Project {
	id: string
	title: string,
	link: string,
	thumbnail_path?: string,
	description?: string,
	color?: string
}

export interface Role {
	id: string,
	title: string,
	company: string,
	year_start: number,
	year_end?: number,
	accomplishments: string[]
}

export const LOADING_MESSAGE = 'Loading...';
export const SECTION_KEYS = {
	DESIGN: "design",
	ENGINEERING: "engineering",
	ABOUT_ME: "about me",
	DESIGN_MINDED_SOFTWARE_ENGINEER: "design-minded software engineer",
	ARTIFICIAL_INTELLIGENCE: "artificial intelligence",
	DATABASES: "databases",
	DISTRIBUTED_SYSTEMS: "distributed systems",
	CLOUD: "cloud",
	ARCHITECTURE: "architecture",
	QUALITY_ASSURANCE: "quality assurance",
	CONTINUOUS_IMPROVEMENT: "continuous improvement",
	LEAN_PROCESSES: "lean processes",
	ENVIRONMENT: "environment",
	PLANNED_OBSOLESCENCE: "planned obsolescence",
	AFFORDABLE_HOUSING: "affordable housing",
	BACKEND: "backend",
	FRONTEND: "frontend",
} as const;

export interface translation {
	lang: string;
	heading: string;
	placeholder: string;
	comingSoon: string;
}
