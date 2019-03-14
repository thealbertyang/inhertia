export const set = ( name, data, dispatch) => {
 dispatch({ type: 'MESSAGES_SET', name, data })
}
