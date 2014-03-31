class Navigation < ActiveRecord::Base
  attr_accessible :title, :rotation

  has_many :sub_navigations, class_name: 'SubNavigation', foreign_key: :parent_nav_id

  scope :main_navigation, -> { where(parent_nav_id: nil).order(:rotation) }
end
