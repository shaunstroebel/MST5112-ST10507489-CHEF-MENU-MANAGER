import React, {useState} from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const COURSES = ['Starter', 'Main Course', 'Dessert'];

export default function App() {
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('');
  const [price, setPrice] = useState('');
  const [showCourses, setShowCourses] = useState(false);
  const [errors, setErrors] = useState({});
  const [menuItems, setMenuItems] = useState([]);

  const validate = () => {
    const nextErrors = {};

    if (!dishName.trim()) nextErrors.dishName = 'Dish name is required.';
    if (!description.trim()) nextErrors.description = 'Description is required.';
    if (!course) nextErrors.course = 'Please select a course.';

    if (!price.trim()) {
      nextErrors.price = 'Price is required.';
    } else if (!/^\d+(\.\d{1,2})?$/.test(price.trim()) || Number(price) <= 0) {
      nextErrors.price = 'Enter a valid price greater than 0.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const clearFieldError = field => {
    if (errors[field]) {
      setErrors(current => ({...current, [field]: undefined}));
    }
  };

  const addMenuItem = () => {
    if (!validate()) {
      Alert.alert(
        'Incomplete information',
        'Please correct the highlighted fields before adding the menu item.',
      );
      return;
    }

    const item = {
      id: `${Date.now()}-${Math.random()}`,
      dishName: dishName.trim(),
      description: description.trim(),
      course,
      price: Number(price).toFixed(2),
    };

    setMenuItems(current => [item, ...current]);

    setDishName('');
    setDescription('');
    setCourse('');
    setPrice('');
    setErrors({});
    setShowCourses(false);

    Alert.alert('Success', `${item.dishName} was added to the menu.`);
  };

  const renderItem = ({item}) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.dishName}>{item.dishName}</Text>
        <Text style={styles.price}>R{item.price}</Text>
      </View>

      <View style={styles.badge}>
        <Text style={styles.badgeText}>{item.course}</Text>
      </View>

      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#172033" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          data={menuItems}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <>
              <View style={styles.header}>
                <Text style={styles.title}>Chef's Menu Manager</Text>
                <Text style={styles.subtitle}>
                  Manage restaurant menu items
                </Text>
              </View>

              <View style={styles.formCard}>
                <Text style={styles.sectionTitle}>Add Menu Item</Text>

                <Text style={styles.label}>Dish Name *</Text>
                <TextInput
                  style={[styles.input, errors.dishName && styles.errorInput]}
                  placeholder="Enter dish name"
                  placeholderTextColor="#8A919C"
                  value={dishName}
                  onChangeText={text => {
                    setDishName(text);
                    clearFieldError('dishName');
                  }}
                  autoCapitalize="words"
                />
                {errors.dishName && (
                  <Text style={styles.errorText}>{errors.dishName}</Text>
                )}

                <Text style={styles.label}>Description *</Text>
                <TextInput
                  style={[
                    styles.input,
                    styles.descriptionInput,
                    errors.description && styles.errorInput,
                  ]}
                  placeholder="Enter dish description"
                  placeholderTextColor="#8A919C"
                  value={description}
                  onChangeText={text => {
                    setDescription(text);
                    clearFieldError('description');
                  }}
                  multiline
                  textAlignVertical="top"
                />
                {errors.description && (
                  <Text style={styles.errorText}>{errors.description}</Text>
                )}

                <Text style={styles.label}>Course *</Text>
                <Pressable
                  onPress={() => setShowCourses(current => !current)}
                  style={[
                    styles.input,
                    styles.courseSelector,
                    errors.course && styles.errorInput,
                  ]}>
                  <Text
                    style={
                      course ? styles.selectedText : styles.placeholderText
                    }>
                    {course || 'Select a course'}
                  </Text>
                  <Text style={styles.chevron}>
                    {showCourses ? '▲' : '▼'}
                  </Text>
                </Pressable>

                {showCourses && (
                  <View style={styles.courseMenu}>
                    {COURSES.map((courseOption, index) => (
                      <Pressable
                        key={courseOption}
                        onPress={() => {
                          setCourse(courseOption);
                          setShowCourses(false);
                          clearFieldError('course');
                        }}
                        style={[
                          styles.courseOption,
                          index === COURSES.length - 1 &&
                            styles.lastCourseOption,
                        ]}>
                        <Text style={styles.courseOptionText}>
                          {courseOption}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                )}

                {errors.course && (
                  <Text style={styles.errorText}>{errors.course}</Text>
                )}

                <Text style={styles.label}>Price (R) *</Text>
                <TextInput
                  style={[styles.input, errors.price && styles.errorInput]}
                  placeholder="e.g. 129.99"
                  placeholderTextColor="#8A919C"
                  value={price}
                  onChangeText={text => {
                    setPrice(text.replace(/[^0-9.]/g, ''));
                    clearFieldError('price');
                  }}
                  keyboardType="decimal-pad"
                />
                {errors.price && (
                  <Text style={styles.errorText}>{errors.price}</Text>
                )}

                <Pressable
                  onPress={addMenuItem}
                  style={({pressed}) => [
                    styles.addButton,
                    pressed && styles.pressed,
                  ]}>
                  <Text style={styles.addButtonText}>+ Add Menu Item</Text>
                </Pressable>
              </View>

              <View style={styles.listHeader}>
                <Text style={styles.sectionTitle}>Menu Items</Text>
                <Text style={styles.itemCount}>
                  {menuItems.length} {menuItems.length === 1 ? 'item' : 'items'}
                </Text>
              </View>
            </>
          }
          ListEmptyComponent={
            <View style={styles.emptyCard}>
              <Text style={styles.emptyEmoji}>🍽️</Text>
              <Text style={styles.emptyTitle}>No menu items added</Text>
              <Text style={styles.emptyText}>
                Add your first menu item using the form above.
              </Text>
            </View>
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F5F8',
  },
  flex: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 32,
  },
  header: {
    backgroundColor: '#172033',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 25,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    color: '#CBD2DE',
    fontSize: 15,
    marginTop: 6,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 18,
    borderRadius: 14,
    elevation: 3,
  },
  sectionTitle: {
    color: '#172033',
    fontSize: 20,
    fontWeight: '800',
  },
  label: {
    color: '#343D4D',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 7,
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#D3D8E0',
    borderRadius: 9,
    paddingHorizontal: 13,
    fontSize: 15,
    color: '#172033',
    backgroundColor: '#FFFFFF',
  },
  errorInput: {
    borderColor: '#C62828',
    borderWidth: 1.5,
  },
  descriptionInput: {
    height: 92,
    paddingTop: 12,
  },
  errorText: {
    color: '#C62828',
    fontSize: 12,
    marginTop: 5,
  },
  courseSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  placeholderText: {
    color: '#8A919C',
    fontSize: 15,
  },
  selectedText: {
    color: '#172033',
    fontSize: 15,
  },
  chevron: {
    color: '#596273',
    fontSize: 12,
  },
  courseMenu: {
    borderWidth: 1,
    borderColor: '#D3D8E0',
    borderRadius: 9,
    marginTop: 5,
    overflow: 'hidden',
  },
  courseOption: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E7E9ED',
    backgroundColor: '#FFFFFF',
  },
  lastCourseOption: {
    borderBottomWidth: 0,
  },
  courseOptionText: {
    color: '#172033',
    fontSize: 15,
  },
  addButton: {
    minHeight: 50,
    marginTop: 22,
    borderRadius: 9,
    backgroundColor: '#172033',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  listHeader: {
    marginHorizontal: 18,
    marginTop: 2,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemCount: {
    color: '#697383',
    fontSize: 13,
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#172033',
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  dishName: {
    flex: 1,
    color: '#172033',
    fontSize: 18,
    fontWeight: '800',
    marginRight: 10,
  },
  price: {
    color: '#172033',
    fontSize: 17,
    fontWeight: '800',
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E9ECF1',
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 4,
    marginTop: 7,
    marginBottom: 7,
  },
  badgeText: {
    color: '#394252',
    fontSize: 12,
    fontWeight: '700',
  },
  description: {
    color: '#555F6F',
    fontSize: 14,
    lineHeight: 20,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    padding: 30,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E4E9',
  },
  emptyEmoji: {
    fontSize: 34,
  },
  emptyTitle: {
    color: '#172033',
    fontSize: 17,
    fontWeight: '800',
    marginTop: 8,
  },
  emptyText: {
    color: '#697383',
    textAlign: 'center',
    fontSize: 14,
    marginTop: 5,
  },
});
