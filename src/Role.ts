declare enum RoleEnum {
	Attacker,
	Defender
}

export type Role = RoleEnum
export type RoleName = keyof typeof RoleEnum

export namespace Role {
	export type Attacker = RoleEnum.Attacker
	export type Defender = RoleEnum.Defender
}

export const Role = {
	Attacker: 1 as Role.Attacker,
	Defender: 2 as Role.Defender,
} as const

export const RolesToNames: Readonly<Record<number, string>> = {
	1: "Attacker",
	2: "Defender",
}
