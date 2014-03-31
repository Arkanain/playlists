task navigation: :environment do
  if File.file?("#{Rails.root}/config/locales/navigation.yml")
    yml = YAML.load_file("#{Rails.root}/config/locales/navigation.yml")
    yml.each_with_index do |(key, value), index|
      nav_item = Navigation.create(title: key, rotation: index)
      unless value.blank?
        value.each_with_index do |sub_nav, index|
          SubNavigation.create(title: sub_nav, parent_nav_id: nav_item.reload.id, rotation: index)
        end
      end
    end
  end
end