import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updatePassword
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { auth, db } from './firebase';

const db_api = {
  // Authentication
  async login(email, password) {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      return userDoc.data();
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Invalid login credentials');
    }
  },

  async logout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  // Users
  async getUsers() {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, orderBy('created_at', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  async getUserByEmail(email) {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const snapshot = await getDocs(q);
      if (snapshot.empty) return null;
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      console.error('Error fetching user by email:', error);
      return null;
    }
  },

  async createUser(userData) {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      const userDoc = {
        id: user.uid,
        username: userData.username,
        name: userData.name,
        email: userData.email,
        role: userData.role || 'user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      await setDoc(doc(db, 'users', user.uid), userDoc);
      return userDoc;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  async updateUser(id, userData) {
    try {
      if (userData.password) {
        const user = auth.currentUser;
        await updatePassword(user, userData.password);
      }

      const userRef = doc(db, 'users', id);
      const updateData = {
        username: userData.username,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        updated_at: new Date().toISOString()
      };

      await updateDoc(userRef, updateData);
      return { id, ...updateData };
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  async deleteUser(id) {
    try {
      await deleteDoc(doc(db, 'users', id));
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // News
  async getNews() {
    try {
      const newsRef = collection(db, 'news');
      const q = query(newsRef, orderBy('created_at', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
  },

  async createNews(newsData) {
    try {
      const newsRef = doc(collection(db, 'news'));
      const news = {
        ...newsData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      await setDoc(newsRef, news);
      return { id: newsRef.id, ...news };
    } catch (error) {
      console.error('Error creating news:', error);
      throw error;
    }
  },

  async updateNews(id, newsData) {
    try {
      const newsRef = doc(db, 'news', id);
      const updateData = {
        ...newsData,
        updated_at: new Date().toISOString()
      };
      await updateDoc(newsRef, updateData);
      return { id, ...updateData };
    } catch (error) {
      console.error('Error updating news:', error);
      throw error;
    }
  },

  async deleteNews(id) {
    try {
      await deleteDoc(doc(db, 'news', id));
    } catch (error) {
      console.error('Error deleting news:', error);
      throw error;
    }
  },

  // Calculations
  async getCalculations() {
    try {
      const calcRef = collection(db, 'calculations');
      const q = query(calcRef, orderBy('created_at', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching calculations:', error);
      throw error;
    }
  },

  async getCalculationsByUser(userId) {
    try {
      const calcRef = collection(db, 'calculations');
      const q = query(
        calcRef,
        where('user_id', '==', userId),
        orderBy('created_at', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching user calculations:', error);
      throw error;
    }
  },

  async createCalculation(calcData) {
    try {
      const calcRef = doc(collection(db, 'calculations'));
      const calculation = {
        ...calcData,
        created_at: new Date().toISOString()
      };
      await setDoc(calcRef, calculation);
      return { id: calcRef.id, ...calculation };
    } catch (error) {
      console.error('Error creating calculation:', error);
      throw error;
    }
  },

  async deleteCalculation(id) {
    try {
      await deleteDoc(doc(db, 'calculations', id));
    } catch (error) {
      console.error('Error deleting calculation:', error);
      throw error;
    }
  }
};

export default db_api;