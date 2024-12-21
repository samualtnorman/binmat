declare enum RoleEnum {
	Defender,
	Attacker
}

export type Role = RoleEnum
export type RoleName = keyof typeof RoleEnum

export namespace Role {
	export type Defender = RoleEnum.Defender
	export type Attacker = RoleEnum.Attacker
}

export const Role = {
	Defender: 1 as Role.Defender,
	Attacker: 2 as Role.Attacker,
} as const

export const RolesToNames: Readonly<Record<number, string>> = {
	1: "Defender",
	2: "Attacker",
}
