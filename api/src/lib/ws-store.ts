const wsConnections = new Map<string, any>();

export const addWebSocket = (userId: string, ws: any) => {
    wsConnections.set(userId, ws)
}

export const removeWebsocket = (userId: string) => {
    wsConnections.delete(userId)
}

export const getActiveUsers = () => {
    return Array.from(wsConnections.keys())
}