export default function UserProfile() {
  return (
    <View style={styles.container}>

      {/* FOTO */}
      <Image
        source={{ uri: "https://i.pravatar.cc/200" }}
        style={styles.avatar}
      />

      {/* NOMBRE */}
      <Text style={styles.name}>Omar</Text>

      {/* MENU */}
      <View style={styles.menu}>

        <TouchableOpacity style={styles.box}>
          <Text style={styles.boxText}>Personal Details</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.box}>
          <Text style={styles.boxText}>Settings</Text>
        </TouchableOpacity>

      </View>

    </View>
z
}
