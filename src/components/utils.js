// 用作于复显查找对应的城市
export const findCurrentData = (data, current, res = []) => {
    if (!current.length || !data) return res;

    const currentData =
        data.find((item) => {
            const first = current[0];
            const currentId = typeof first === 'object' ? first.id : first;

            if (currentId === item.id) {
                const { id, name, children = [] } = item;
                res.push({
                    id,
                    name,
                    parent: data,
                    children,
                    isLast: !children.length
                });

                return true;
            }

            return false;
        }) || {};

    return findCurrentData(currentData.children, current.slice(1), res);
};
