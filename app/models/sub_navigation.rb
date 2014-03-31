class SubNavigation < Navigation
  attr_accessible :title, :rotation, :parent_nav_id

  belongs_to :navigation, class_name: 'Navigation', foreign_key: :parent_nav_id
end