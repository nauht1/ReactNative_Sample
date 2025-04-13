import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootParamList } from '../type/navigationType';
import Icon from 'react-native-vector-icons/Ionicons';
import { Podcast } from '../models/PodcastModel';
import PodcastService from '../services/podcastService';
import { FlatList } from 'react-native-gesture-handler';
import BottomSheet from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CustomBottomSheet from '../components/common/OptionsBottomSheet';
import AuthenticateService from '../services/authenticateService';
import { logout } from '../redux/reducer/authSlice';
import { defaultAvatar, defaultCover } from '../utils/fileUtil';
import Toast from 'react-native-toast-message';
import UserService from '../services/userService';

type ProfileScreenRouteProp = RouteProp<RootParamList, 'Profile'>;

const ProfileScreen: React.FC = () => {
  const route = useRoute<ProfileScreenRouteProp>();
  const { username } = route.params || {};
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const isCurrentUser = !username || username === currentUser?.username;
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<RootParamList>>();
  const [user, setUser] = useState(currentUser);
  const [isFollowing, setIsFollowing] = useState(user?.follow || false);
  const [selectedTab, setSelectedTab] = useState('Video');
  const [myPodcasts, setMyPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const sheetRef = useRef<BottomSheet>(null);

  const fullName = user?.fullname || `${user?.lastName || ''} ${user?.middleName || ''} ${user?.firstName || ''}`.trim();
  const avatarSource = user?.avatarUrl && user.avatarUrl !== '' ? { uri: user.avatarUrl } : defaultAvatar;
  const coverSource = user?.coverUrl && user.coverUrl !== '' ? { uri: user.coverUrl } : defaultCover;
  useEffect(() => {
    if (!isCurrentUser) {
      fetchUserProfile();
    }
  }, [username]);

  useEffect(() => {
    if (selectedTab === 'Video') {
      fetchMyPodcasts();
    }
  }, [selectedTab]);

  const fetchUserProfile = async () => {
    try {
      const response = await UserService.getUserByUsername(username);
      console.log(response);
      setUser(response);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchMyPodcasts = async () => {
    try {
      if (isCurrentUser) {
        const response = await PodcastService.getPodcastBySelf(0, 10);
        setMyPodcasts(response.content);
      }
      else {
        const response = await PodcastService.getUserPodcasts(username);
        setMyPodcasts(response.content);
      }
    } catch (error) {
      console.error('Error retrieving my podcasts from server', error);
    } finally {
      setLoading(false);
    }
  };

  const bottomSheetOptions = isCurrentUser
  ? [
      { label: 'Share', onPress: () => Toast.show({ type: 'info', text1: 'Coming soon!' }) },
      { label: 'Settings', onPress: () => Toast.show({ type: 'info', text1: 'Coming soon!' }) },
      { label: 'Logout', onPress: () => {
          AuthenticateService.logOut(navigation);
          dispatch(logout());
        },
      },
    ]
  : [
      { label: 'Share', onPress: () => Toast.show({ type: 'info', text1: 'Coming soon!' }) },
      { label: 'Report', onPress: () => Toast.show({ type: 'info', text1: 'Reported!' }) },
    ];

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        // Gọi API để unfollow
      } else {
        // Gọi API để follow
      }
      setIsFollowing(!isFollowing); // Cập nhật trạng thái
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
      Toast.show({ type: 'error', text1: 'Something went wrong!' });
    }
  };
  
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    position: 'absolute',
    top: 10,
  },
  headerButton: {
    padding: 5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  coverUrl: {
    width: '90%',
    height: 150,
    borderRadius: 15,
    resizeMode: 'cover',
    marginTop: 15,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    width: '90%',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  profileDetails: {
    marginLeft: 15,
    flex: 1,
  },
  fullname: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  username: {
    fontSize: 14,
    fontWeight: 'semibold',
    fontStyle: 'italic',
  },
  stats: {
    marginTop: 5,
  },
  statsText: {
    fontSize: 14,
    fontWeight: 'regular',
  },
  editButton: {
    width: '90%',
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "center",
    gap: 10,
    backgroundColor: '#d4d4d4',
    borderRadius: 15,
    marginTop: 20,
  },
  followButton: {
    width: '90%',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007BFF',
    borderRadius: 15,
    marginTop: 20,
  },
  unfollowButton: {
    backgroundColor: '#a09bbf',
  },
  followButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#2647bf',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#2647bf',
    fontWeight: 'bold',
  },
  listContent: {
    width: '100%',
    paddingHorizontal: 10,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 18,
    color: '#666',
  }
});

export default ProfileScreen;