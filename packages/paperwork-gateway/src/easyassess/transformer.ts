const buildHierarchy = (ministries: any, tree: any) => {
  const affiliates = ministries.map(({ id, supervisorId, ministries }: any) => {
    const organization = {
      uid: id,
      supervisorUid: supervisorId,
      affiliates: [],
    };
    return buildHierarchy(ministries, organization);
  });

  return { ...tree, affiliates };
};

export default (session: any) => {
  if (!session.data) return null;
  const { currentUser } = session.data;
  if (!currentUser) return null;
  const { ministries = [] } = currentUser;
  const ministry = ministries[0] || { id: 'admin' };
  const { id, supervisorId, ministries: affiliates } = ministry;
  const principle = {
    uid: id,
    supervisorUid: supervisorId,
    affiliates: [],
  };
  return buildHierarchy(affiliates, principle);
};
