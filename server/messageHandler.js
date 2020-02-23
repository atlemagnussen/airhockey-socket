const handler = (msg) => {
    const msgObj = JSON.parse(msg);
    console.log(msgObj.type);
};

export default handler;