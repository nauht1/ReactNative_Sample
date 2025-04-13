import React, { useEffect, useState, useRef } from 'react';
import { 
  View, TextInput, StyleSheet, TouchableOpacity, Text, 
  FlatList, KeyboardAvoidingView, Platform, ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootParamList } from '../type/navigationType';
import { Podcast } from '../models/PodcastModel';
import UserService from '../services/userService';
import PodcastItem from '../components/podcast/PodcastItem';

const SearchScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootParamList>>();
  const searchInputRef = useRef<TextInput>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [postResults, setPostResults] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(false);
  const [postPage, setPostPage] = useState(0);
  const [totalPostPages, setTotalPostPages] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  }, []);

  const handleBack = () => {
    navigation.goBack(); // Quay lại màn hình trước đó
  };

  const fetchPosts = async (query: string, page: number = 0) => {
    if (loading || (page >= totalPostPages && page !== 0)) return; // Ngăn gọi API khi đang tải hoặc hết trang
    setLoading(true);
    try {
      const postResponse = await UserService.searchPodcasts(query, page, 2);
      const podcasts: Podcast[] = postResponse.content.map((item: any): Podcast => ({
        id: item.id,
        title: item.title,
        content: item.content,
        thumbnailUrl: item.thumbnailUrl,
        videoUrl: item.videoUrl,
        genres: item.genres,
        views: item.views,
        duration: item.duration,
        totalLikes: item.totalLikes,
        totalComments: item.totalComments,
        username: item.username ?? item.user?.username ?? "unknown",
        createdDay: item.createdDay,
        lastEdited: item.lastEdited,
        user: item.user,
        active: item.active,
        liked: item.liked
      }));
      setPostResults(prevPosts => [...prevPosts, ...podcasts]);
      setTotalPostPages(postResponse.totalPages || 0);
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    setPostResults([]);
    setPostPage(0);
    setTotalPostPages(0);
    fetchPosts(searchQuery, 0);
  };

  const handleLoadMore = () => {
    if (postPage + 1 < totalPostPages) {
      setPostPage(prevPage => prevPage + 1);
      fetchPosts(searchQuery, postPage + 1);
    }
  };

  const renderItem = ({ item }: { item: Podcast }) => {
    return <PodcastItem podcast={item} />;
  };

  const resetSearch = () => {
    setSearchQuery('');
    setPostResults([]);
    setPostPage(0);
    setTotalPostPages(0);
    searchInputRef.current?.blur();
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <View style={styles.searchInputContainer}>
            <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              ref={searchInputRef}
              style={styles.searchInput}
              placeholder="Search podcasts..."
              placeholderTextColor="#999"
              value={searchQuery}
              onSubmitEditing={handleSubmit}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity 
                onPress={resetSearch}
                style={styles.clearButton}
              >
                <Icon name="close-circle" size={20} color="#666" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {loading && postResults.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      ) : (
        <FlatList
          data={postResults}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          style={styles.podcastList}
          ListFooterComponent={
            loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#007AFF" />
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="mic-outline" size={40} color="#999" />
              <Text style={styles.noResults}>No podcasts found</Text>
            </View>
          }
        />
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6e4ed',
  },
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingTop: Platform.OS === 'ios' ? 50 : 0,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  backButton: {
    padding: 5,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f3f4',
    borderRadius: 25,
    marginLeft: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 0,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  noResults: {
    marginTop: 8,
    fontSize: 16,
    color: '#999',
  },
  podcastList: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
});

export default SearchScreen;