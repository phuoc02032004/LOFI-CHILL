import admin from 'firebase-admin';

const db = admin.firestore();

// Get all user
export const getAllUser = ({ }) => new Promise(async (resolve, reject) => {
    try {
        const usersSnapshot = await db.collection('users').get();
        const users = usersSnapshot.docs.map(doc => doc.data());
        resolve({
            err: 0,
            mes: 'Get all user successfully',
            user: users
        });
    } catch (error) {
        reject(error);
        return { status: 500, message: 'Error get all user', error };
    }
});

// GET a specific user
export const getSpecificUser = ({ id }) => new Promise(async (resolve, reject) => {
    try {
        const userRef = db.collection('users').doc(id);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            return resolve({
                status: 404,
                message: 'User not found',
            });
        }
        resolve({
            err: 0,
            mes: 'Get specific user successfully',
            user: userDoc.data()
        });
    } catch (error) {
        reject(error);
        return { status: 500, message: 'Error get specific user', error };
    }
});

// PUT (update) a user
export const updateUser = ({ id, data }) => new Promise(async (resolve, reject) => {
    try {
        const userRef = db.collection('users').doc(id);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            return resolve({
                status: 404,
                message: 'User not found',
            });
        }
        await userRef.update(data);

        // Lấy lại dữ liệu mới sau khi cập nhật
        const updatedDoc = await userRef.get();
        resolve({
            err: 0,
            mes: 'Update user successfully',
            user: updatedDoc.data() // Lấy dữ liệu mới nhất
        });
    } catch (error) {
        reject(error);
        return { status: 500, message: 'Error update user', error };
    }
});

// DELETE a user
export const deleteUser = ({ id }) => new Promise(async (resolve, reject) => {
    try {
        const userRef = db.collection('users').doc(id);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            return resolve({
                status: 404,
                message: 'User not found',
            });
        }
        await userRef.delete();
        resolve({
            err: 0,
            mes: 'Delete user successfully',
        });
    } catch (error) {
        reject(error);
        return { status: 500, message: 'Error delete user', error };
    }
});
