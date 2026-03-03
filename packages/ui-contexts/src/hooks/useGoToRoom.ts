import type { IRoom, ITeam, Serialized } from '@rocket.chat/core-typings';
import { useEffectEvent } from '@rocket.chat/fuselage-hooks';
// import type { Key } from 'react';

import { useEndpoint } from './useEndpoint';
import { useRouter } from './useRouter';

type RoomsInfoResult = Serialized<{
	room: IRoom | undefined;
	team: Pick<ITeam, 'name' | 'roomId' | 'type' | '_id'> | undefined;
	parent: Pick<IRoom, '_id' | 'name' | 'fname' | 't' | 'prid' | 'u'> | undefined;
}>;

export const useGoToRoom = ({ replace = false }: { replace?: boolean } = {}): ((rid: IRoom['_id']) => void) => {
	const router = useRouter();
	const getRoomById = (useEndpoint as any)('GET', '/v1/rooms.info') as (
		params: { roomId: string } | { roomName: string },
	) => Promise<RoomsInfoResult>;

	return useEffectEvent(async (roomId: string) => {
		const { room } = await getRoomById({ roomId });

		if (!room) {
			return;
		}

		const { t, name, _id: rid } = room;

		const { path } = router.getRoomRoute(t, ['c', 'p'].includes(t) ? { name } : { rid });

		router.navigate(
			{
				pathname: path,
			},
			{ replace },
		);
	});
};
