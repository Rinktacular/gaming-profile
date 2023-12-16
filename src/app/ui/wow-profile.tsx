import { Character } from "@/app/lib/actions";

export default function WowProfile({ character }: { character: Character }) {

  const factionColor = character.faction.type === 'HORDE' ? 'text-rose-500' : 'text-sky-500';
  const factionBorderColor = character.faction.type === 'HORDE' ? 'border-rose-500' : 'border-sky-500';

  return (
    <div className={`flex flex-row justify-evenly border-solid border-2 ${factionBorderColor} rounded hover:border-dotted hover:border-amber-300 w-2/5 h-12 my-8 content-center`}>
      <p className="text-amber-500 mt-2">{character.name}</p>
      <p className="text-amber-800 mt-2">{character.level}</p>
      <p className={`${factionColor} mt-2`}>{character.faction.name}</p>
      <p className="text-line-200 mt-2">{character.realm.name}</p>
    </div>
  )
}